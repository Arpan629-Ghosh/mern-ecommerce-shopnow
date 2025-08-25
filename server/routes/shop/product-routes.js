const express = require("express");

const {
  getFilterProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/fetch", getFilterProducts);
router.get("/fetch/:id", getProductDetails);

module.exports = router;
