const { Cart } = require("../models/order_cart_item");

async function opeNewCart(cart) {
  return await cart.save();
}

async function updateCart(cart) {
  try {
    const result = await Cart.updateOne({ _id: cart._id }, cart);

    if (result.nModified > 0) {
      return { message: "Update successful!" };
    } else {
      return { error: "Update Failed!" };
    }
  } catch (error) {
    return { error: "Update Failed!" };
  }
}

async function getActiveCart(userId) {
  return await Cart.find({ client: userId, $and: [{ isActive: true }] }).populate("cartItems.product");
}

module.exports = {
  opeNewCart,
  updateCart,
  getActiveCart,
};
