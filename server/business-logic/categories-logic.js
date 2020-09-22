const Category = require("../models/category");

function getAllCategories() {
  return Category.find().exec();
}

module.exports = {
  getAllCategories,
};
