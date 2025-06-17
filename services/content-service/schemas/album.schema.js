const mongoose = require("mongoose");

const albumsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Artists"
    },
    release: {
        type: Date,
        required: true,
        default: Date.now,
    },
    coverImage: {
        type: String,
        required: false,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Albums", albumsSchema);