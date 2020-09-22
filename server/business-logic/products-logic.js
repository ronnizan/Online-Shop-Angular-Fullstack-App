const Product = require("../models/product");

function addNewProduct(product) {
  return product.save();
}

async function getAllProductsAmount() {
  try {
    const products = await Product.find();
    return products.length;
  } catch (error) {
    return 0;
  }
}

async function updateProduct(product) {
  try {
    const result = await Product.updateOne({ _id: product._id }, product);

    if (result.nModified > 0) {
      return { message: "Product Updated Successfully" };
    } else {
      return { error: "Product Update Failed!" };
    }
  } catch (error) {
    return { error: "Product Update Failed" };
  }
}


async function getProductsByCategory(categoryId) {
  try {
    const products = await Product.find({ category: categoryId });
    return products;
  } catch (error) {
    return { error };
  }
}
async function getProductsForHomePage() {
  try {
    const milkAndEggsProducts = await Product.find({
      category: "5f4280db9d71cd3f5c1d2723",
    }).limit(3);
    const vegetablesAndFruitsProducts = await Product.find({
      category: "5f42810f9d71cd3f5c1d2724",
    }).limit(3);
    const meatAndFishProducts = await Product.find({
      category: "5f42811c9d71cd3f5c1d2725",
    }).limit(3);
    const wineAndDrinks = await Product.find({
      category: "5f42812d9d71cd3f5c1d2726",
    }).limit(3);
    const products = {
      milkAndEggsProducts,
      vegetablesAndFruitsProducts,
      meatAndFishProducts,
      wineAndDrinks,
    };
    return products;
  } catch (error) {
    return { error };
  }
}

module.exports = {
  addNewProduct,
  getAllProductsAmount,
  updateProduct,
  getProductsByCategory,
  getProductsForHomePage,
};
