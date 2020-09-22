const { check } = require("express-validator");

const cartItemValidator = [
  check("product").not().isEmpty().withMessage("product is required"),
  check("totalPrice")
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage("Total Price is required"),
  check("amount").not().isEmpty().isNumeric().withMessage("amount is required"),
];

module.exports = {
    cartItemValidator,
  };
    