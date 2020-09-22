const express = require("express");
const multer = require("multer");
const {
  updateProductValidator,
  addProductValidator,
} = require("../validators/product");
const { runValidation } = require("../validators");
const Product = require("../models/product");
const {
  validateAdminToken,
  validateUserToken,
} = require("../middleware/check-auth");
const productsLogic = require("../business-logic/products-logic");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "./images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "/add-product",
  validateAdminToken,
  multer({ storage: storage }).single("image"),
  addProductValidator,
  runValidation,
  async (req, res) => {
    try {
      const url = req.protocol + "://" + req.get("host");
      const product = new Product({
        name: req.body.name,
        price: +req.body.price,
        imagePath: url + "/images/" + req.file.filename,
        category: req.body.category,
      });
      const createdProduct = await productsLogic.addNewProduct(product);
      return res.status(201).json(createdProduct);
    } catch (error) {
      res.status(500).json({ error: "server error" });
    }
  }
);
router.get("/products-amount", async (req, res) => {
  try {
    const totalProductsAmount = await productsLogic.getAllProductsAmount();
    return res.status(200).json(totalProductsAmount);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

router.put(
  "/update/:id",
  validateAdminToken,
  multer({ storage: storage }).single("image"),
  updateProductValidator,
  runValidation,
  async (req, res) => {
    try {
      let imagePath = req.body.imagePath;
      if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
      }
      const product = new Product({
        _id: req.params.id,
        name: req.body.name,
        price: +req.body.price,
        imagePath: imagePath,
        category: req.body.category,
      });
      const result = await productsLogic.updateProduct(product);
      if (result.error) {
        return res.status(400).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "server error" });
    }
  }
);


router.get(
  "/products-by-category/:categoryId",
  validateUserToken,
  async (req, res) => {
    try {
      const products = await productsLogic.getProductsByCategory(
        req.params.categoryId
      );
      if (products.error) {
        return res.status(400).json({ error: "No products found" });
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "server error" });
    }
  }
);
router.get("/products-for-homepage", async (req, res) => {
  try {
    const products = await productsLogic.getProductsForHomePage();
    if (products.error) {
      return res.status(400).json({ error: "No products found" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
