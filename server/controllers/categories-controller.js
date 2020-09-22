const express = require("express");
const Category = require("../models/category");
const categoryLogic = require("../business-logic/categories-logic");
const {
  validateUserToken,
} = require("../middleware/check-auth");
const router = express.Router();

router.get("/", validateUserToken, async (req, res) => {
  try {
    const categories = await categoryLogic.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
