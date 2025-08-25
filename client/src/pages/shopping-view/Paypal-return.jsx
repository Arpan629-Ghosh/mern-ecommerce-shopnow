import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // ✅ New PayPal SDK returns token instead of paymentId/payerId
  const paypalOrderId = params.get("token");

  useEffect(() => {
    if (paypalOrderId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      if (orderId) {
        dispatch(capturePayment({ orderId, paypalOrderId })).then((data) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            window.location.href = "/shop/payment-success";
          } else {
            window.location.href = "/shop/payment-failed";
          }
        });
      }
    }
  }, [paypalOrderId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
