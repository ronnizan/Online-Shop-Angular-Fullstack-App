const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        }
    }, { versionKey: false }
);

module.exports = mongoose.model("Category", CategorySchema);
