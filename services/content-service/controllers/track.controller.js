const { isValidObjectId } = require("mongoose");
const Tracks = require("../schemas/track.schema");
const { fieldValidator } = require("../../../shared/fieldValidator");

const createTrack = async ({ title, artist_id, album_id, duration_sec, genre, audio_url }) => {
    try {

        const requestedFields = { title, artist_id, album_id, duration_sec, genre, audio_url };
        const requiredFields = ["title", "artist_id", "album_id", "duration_sec", "genre", "audio_url"];

        const isValid = fieldValidator(requestedFields, requiredFields);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(artist_id)) throw new Error("invalid request id");

        const trackExists = await Tracks.findOne({ title, artist: artist_id, album: album_id, isDeleted: false });
        if (trackExists) throw new Error("album already exists");

        const newTrack = await Tracks.create({ title, genre, artist: artist_id, album: album_id, durationSec: duration_sec, audioUrl: audio_url })
        if (!newTrack) throw new Error("unable to create track");

        return {
            success: true,
            message: "track created",
            track: {
                track_id: newTrack._id,
                title: newTrack.title,
                artist_id: newTrack.artist,
                album_id: newTrack.album,
                duration_sec: newTrack.durationSec,
                genre: newTrack.genre,
                audio_url: newTrack.audioUrl,
                play_count: newTrack.playCount,
                created_at: newTrack.createdAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            track: {}
        }
    }
}
const getTrack = async ({ track_id }) => {
    try {

        const isValid = fieldValidator({ track_id }, ["track_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(track_id)) throw new Error("invalid request id");

        const track = await Tracks.findById(track_id);
        if (!track) throw new Error("track not found");

        return {
            success: true,
            message: "track fetched",
            track: {
                track_id: track._id,
                title: track.title,
                artist_id: track.artist,
                album_id: track.album,
                duration_sec: track.durationSec,
                genre: track.genre,
                audio_url: track.audioUrl,
                play_count: track.playCount,
                created_at: track.createdAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            album: {}
        }
    }
}
const updateTrack = async ({ track_id, title, artist_id, album_id, duration_sec, genre, audio_url }) => {
    try {

        const requestedFields = { track_id, title, artist_id, album_id, duration_sec, genre, audio_url };
        const requiredFields = ["track_id", "title", "artist_id", "album_id", "duration_sec", "genre", "audio_url"];

        const isValid = fieldValidator(requestedFields, requiredFields);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(artist_id) || !isValidObjectId(album_id) || !isValidObjectId(track_id)) throw new Error("invalid request id");

        const updatedTrack = await Tracks.findByIdAndUpdate(track_id,
            { $set: { title, genre, artist: artist_id, album: album_id, durationSec: duration_sec, audioUrl: audio_url } },
            { new: true });

        if (!updatedTrack) throw new Error("track not found to update");

        return {
            success: true,
            message: "track updated",
            track: {
                track_id: updatedTrack._id,
                title: updatedTrack.title,
                artist_id: updatedTrack.artist,
                album_id: updatedTrack.album,
                duration_sec: updatedTrack.durationSec,
                genre: updatedTrack.genre,
                audio_url: updatedTrack.audioUrl,
                play_count: updatedTrack.playCount,
                created_at: updatedTrack.createdAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            album: {}
        }
    }
}
const deleteTrack = async ({ track_id }) => {
    try {
        const isValid = fieldValidator({ track_id }, ["track_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(track_id)) throw new Error("invalid request id");

        const track = await Tracks.findByIdAndUpdate(track_id, { $set: { isDeleted: true } }, { new: true });
        if (!track.isDeleted) throw new Error("track not found");

        return {
            success: true,
            message: "track deleted",
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
        }
    }
}
const listTracksByAlbum = async ({ album_id }) => {
    try {
        const isValid = fieldValidator({ album_id }, ["album_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(album_id)) throw new Error("invalid request id");

        let tracks = await Tracks.find({ album: album_id, isDeleted: false })
        tracks = tracks.map(t => {
            return {
                track_id: t._id,
                title: t.title,
                artist_id: t.artist,
                album_id: t.album,
                duration_sec: t.durationSec,
                genre: t.genre,
                audio_url: t.audioUrl,
                play_count: t.playCount,
                created_at: t.createdAt
            }
        })
        return {
            success: true,
            message: "tracks fetched",
            tracks
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            album: {}
        }
    }
}
const incrementTrackPlayCount = async ({ track_id }) => {
    try {
        const isValid = fieldValidator({ track_id }, ["track_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(track_id)) throw new Error("invalid request id");

        const track = await Tracks.findByIdAndUpdate(track_id, { $inc: { playCount: 1 } }, { new: true });
        if (!track) throw new Error("track not found");

        return {
            success: true,
            message: "tracks fetched",
            play_count: track.playCount
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            album: {}
        }
    }
}

module.exports = {
    createTrack,
    getTrack,
    updateTrack,
    deleteTrack,
    listTracksByAlbum,
    incrementTrackPlayCount
}