const { Order, Cart } = require("../models/order_cart_item");

async function getAllOrdersAmount() {
  try {
    const orders = await Order.find();
    return orders.length;
  } catch (error) {
    return 0;
  }
}

async function addNewOrder(order) {
  try {
    const closeCart = await Cart.updateOne(
      { _id: order.cart },
      { $set: { isActive: false } }
    );
    if (closeCart.nModified > 0) {
      await order.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function getOrderDetail(cartId) {
  try {
    const orderDetails = await Order.findOne({ cart:cartId}).populate("client");
    if (orderDetails) {
      return {
        firstName: orderDetails.client.firstName,
        lastName: orderDetails.client.lastName,
        totalPrice: orderDetails.totalPrice,
        city: orderDetails.city,
        street: orderDetails.street,
        createdAt: orderDetails.createdAt,
        dateOfDelivery: orderDetails.dateOfDelivery,
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

async function getLastOrder(clientId) {
  try {
    const orders = await Order.find({ client: clientId }).sort("-createdAt");
    if (orders) {
      return orders[0];
    }
    return null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  getAllOrdersAmount,
  addNewOrder,
  getOrderDetail,
  getLastOrder,
};
