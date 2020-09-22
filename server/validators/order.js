const { check } = require("express-validator");

const orderValidator = [
  check("cart").not().isEmpty().withMessage("Cart is required"),
  check("totalPrice")
    .not()
    .isEmpty()
    
    .withMessage("Total Price is required"),
  check("city").not().isEmpty().withMessage("City is required"),
  check("street").not().isEmpty().withMessage("Street is required"),
  check("dateOfDelivery")
    .not()
    .isEmpty()
    .withMessage("Date of delivery is required"),
  check("creditCardLastDigits")
    .not()
    .isEmpty()
    .withMessage("Credit Card LastDigits is required"),
];
module.exports = {
  orderValidator,
};
