const { isValidObjectId } = require("mongoose");
const { fieldValidator } = require("../../../shared/fieldValidator");
const Artists = require("../schemas/artist.schema");

const createArtist = async ({ name, bio, image }) => {
    try {
        const requestedFields = { name, bio, image };
        const requiredFields = ["name", "bio", "image"];

        const isValid = fieldValidator(requestedFields, requiredFields);
        if (!isValid) throw new Error("invalid request payload");

        const artistExists = await Artists.findOne({ name });
        if (artistExists) throw new Error("artist already exists with this name");

        const artist = await Artists.create(requestedFields);
        if (!artist) throw new Error("unable to create new artist");

        return {
            success: true,
            message: "artist created",
            artist: { artist_id: artist._id, created_at: artist.createdAt, ...artist._doc }
        }

    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            artist: {}
        }
    }
}
const getArtist = async ({ artist_id }) => {
    try {
        const isValid = fieldValidator({ artist_id }, ["artist_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(artist_id)) throw new Error("invalid request id");

        const artist = await Artists.findById(artist_id);
        if (artist.isDeleted) throw new Error("artist is deleted");

        return {
            success: true,
            message: "artist created",
            artist: { artist_id: artist._id, created_at: artist.createdAt, ...artist._doc }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            artist: {}
        }
    }
}
const updateArtist = async ({ artist_id, name, bio, image }) => {
    try {
        const requestedFields = { artist_id, name, bio, image };
        const requiredFields = ["artist_id", "name", "bio", "image"];

        const isValid = fieldValidator(requestedFields, requiredFields);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(artist_id)) throw new Error("invalid request id");

        const updatedArtist = await Artists.findOneAndUpdate({ _id: (artist_id), isDeleted: false }, { $set: { name, bio, image } }, { new: true });
        if (!updatedArtist) throw new Error("artist not found to update");

        return {
            success: true,
            message: "artist updated",
            artist: { artist_id: updatedArtist._id, created_at: artist.createdAt, ...updatedArtist._doc }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            artist: {}
        }
    }
}
const deleteArtist = async ({ artist_id }) => {
    try {
        const isValid = fieldValidator({ artist_id }, ["artist_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(artist_id)) throw new Error("invalid request id");

        const artist = await Artists.findByIdAndUpdate(artist_id, { $set: { isDeleted: true } }, { new: true });
        if (!artist) throw new Error("artist not found to delete");

        return { success: true, message: "artist deleted" }
    } catch (error) {
        console.error("error occured:", error.message);
        return { success: false, message: error.message || "internal server error" }
    }
}
const listArtists = async () => {
    try {
        const artists = await Artists.find({ isDeleted: false });
        return { success: true, message: "all artist fetched", artists }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
            artists: []
        }
    }
}


module.exports = {
    createArtist,
    getArtist,
    updateArtist,
    deleteArtist,
    listArtists
}