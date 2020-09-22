const User = require("./user")
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Product", required: true },
    totalPrice: Number,
    amount: Number,
  },
  { versionKey: false }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const CartSchema = new mongoose.Schema(
  {
    cartItems: [CartItemSchema],
    client: { type: ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { versionKey: false,timestamps:true }
);

const Cart = mongoose.model("Cart", CartSchema);

const OrderSchema = new mongoose.Schema(
  {
    client: { type: ObjectId, ref: "User" },
    cart: { type: ObjectId, ref: "Cart" },
    totalPrice: { type: Number },
    city: String,
    street: String,
    dateOfDelivery: {
      type: String,
    },
    creditCardLastDigits: {
      type: Number,
    }
  },
  { versionKey: false,timestamps:true }
);
const Order = mongoose.model("Order", OrderSchema);

module.exports = { Cart, CartItem, Order };
