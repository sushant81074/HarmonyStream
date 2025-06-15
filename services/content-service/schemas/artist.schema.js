const mongoose = require("mongoose");

const artistsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    bio: {
        type: String,
        required: false,
        trim: true,
        unique: false,
        default: ""
    },
    image: {
        type: String,
        required: false,
        trim: true,
        unique: false,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Artists", artistsSchema);