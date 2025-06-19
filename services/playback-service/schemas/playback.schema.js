const mongoose = require('mongoose');

const playbacksSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
        trim: true,
    },
    track: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Tracks",
        trim: true,
    },
    album: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Albums",
        trim: true,
    },
    playedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Playbacks", playbacksSchema);