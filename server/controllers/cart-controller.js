const express = require("express");
const { Cart } = require("../models/order_cart_item");
const cartLogic = require("../business-logic/cart-logic");
const {
  validateUserToken,
} = require("../middleware/check-auth");
const router = express.Router();

router.get("/", validateUserToken, async (req, res) => {
  try {
    const cart = new Cart({ cartItems: [], client: req.user._id });

    const newCart = await cartLogic.opeNewCart(cart);

    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});
router.patch("/update-cart", validateUserToken, async (req, res) => {
  try {
    const cart = new Cart({
      _id: req.body._id,
      cartItems: req.body.cartItems
    });

    const updatedCartResult = await cartLogic.updateCart(cart);

    res.json(updatedCartResult);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});
router.get("/get-cart", validateUserToken, async (req, res) => {
  try {

    const cart = await cartLogic.getActiveCart(req.user._id);

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
