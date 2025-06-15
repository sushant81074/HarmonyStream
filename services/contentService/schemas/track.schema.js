const mongoose = require("mongoose");

const tracksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false,
        trim: true,
    },
    artist: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Artists",
        required: true,
        trim: true,
    },
    album: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Albums",
        required: true,
        trim: true,
    },
    durationSec: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        enum: ["Classical", "Pop", "Rock", "Hip-hop", "Electronic", "Folk", "Jazz", "Blues", "Country", "R&B", "Soul", "Metal", "Mixed"],
        default: "Mixed",
        trim: true,
    },
    audioUrl: {
        type: String,
        required: true,
        trim: true
    },
    playCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Tracks", tracksSchema);