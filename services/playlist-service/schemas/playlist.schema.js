const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
        required: true,
        trim: true,
    },
    tracks: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Tracks",
        trim: true,
    }],
    isPublic: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("Playlists", playlistSchema);