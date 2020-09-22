const { check } = require("express-validator");

const addProductValidator = [
  check("name").not().isEmpty().withMessage("Product name is required"),
  check("price").not().isEmpty().withMessage("Product price is required"),
  check("category").not().isEmpty().withMessage("Product category is required"),
];

const updateProductValidator = [
  check("name").not().isEmpty().withMessage("Product name is required"),
  check("price").not().isEmpty().withMessage("Product price is required"),
  check("category").not().isEmpty().withMessage("Product category is required"),
];
module.exports = {
  addProductValidator,
  updateProductValidator
};
