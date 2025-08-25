// server/controllers/shop/order-controller.js
const axios = require("axios");
const { Buffer } = require("buffer");
const {
  PAYPAL_API,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
} = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// ------------ internal helper: get OAuth access token ------------
async function getPayPalAccessToken() {
  const basic = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const resp = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return resp.data.access_token;
}

// ---------------- Create PayPal Order ----------------
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems = [],
      addressInfo = {},
      orderStatus = "pending",
      paymentMethod = "paypal",
      paymentStatus = "pending",
      totalAmount,
      orderDate = new Date(),
      orderUpdateDate = new Date(),
      cartId,
    } = req.body;

    if (typeof totalAmount !== "number" || isNaN(totalAmount)) {
      return res
        .status(400)
        .json({ success: false, message: "totalAmount must be a number" });
    }

    const accessToken = await getPayPalAccessToken();

    // Build minimal, safe payload (amount only; items optional)
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // PayPal sandbox expects USD
            value: Number(totalAmount).toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}http://localhost:5173/shop/paypal-cancel`,
      },
    };

    const orderResp = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paypalOrder = orderResp.data; // { id, status, links: [...] }
    const approvalURL = paypalOrder.links?.find(
      (l) => l.rel === "approve"
    )?.href;

    if (!approvalURL) {
      console.error("PayPal createOrder missing approval URL:", paypalOrder);
      return res.status(502).json({
        success: false,
        message: "Unable to get approval link from PayPal",
      });
    }

    // Save pending order in DB
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: paypalOrder.id, // store PayPal Order ID
      payerId: "", // will be set after capture
    });
    await newlyCreatedOrder.save();

    return res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
      paypalOrderId: paypalOrder.id,
    });
  } catch (error) {
    const details = error.response?.data || error.message;
    console.error("PayPal Order Creation Error:", details);
    return res.status(500).json({
      success: false,
      message: "Error while creating PayPal order",
      details,
    });
  }
};

// ---------------- Capture PayPal Payment ----------------
const capturePayment = async (req, res) => {
  try {
    const { orderId, paypalOrderId } = req.body;
    if (!orderId || !paypalOrderId) {
      return res.status(400).json({
        success: false,
        message: "orderId and paypalOrderId are required",
      });
    }

    const accessToken = await getPayPalAccessToken();

    const captureResp = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = captureResp.data;
    const payerId = result?.payer?.payer_id || null;
    const status = result?.status || "UNKNOWN";

    // 🔹 Find order in DB
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found in DB",
      });
    }

    // 🔹 Update DB order
    order.paymentStatus = status === "COMPLETED" ? "Completed" : status;
    order.orderStatus = status === "COMPLETED" ? "Confirmed" : "Pending";
    order.paymentId = paypalOrderId;
    order.payerId = payerId;
    order.orderUpdateDate = new Date();
    await order.save();

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    // 🔹 Delete cart after successful payment
    if (status === "COMPLETED" && order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    return res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      status,
      paypalResponse: result,
    });
  } catch (error) {
    const details = error.response?.data || error.message;
    console.error("PayPal Capture Error:", details);
    return res.status(500).json({
      success: false,
      message: "Error while capturing PayPal payment",
      details,
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
