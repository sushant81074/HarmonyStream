const { isValidObjectId } = require("mongoose");
const Albums = require("../schemas/album.schema");
const { fieldValidator } = require("../../../shared/fieldValidator");

const createAlbum = async ({ title, artist_id, release, cover_image }) => {
    try {

        const requestedFields = { title, artist_id, release, cover_image };
        const requiredFields = ["title", "artist_id", "release", "cover_image"];

        const isValid = fieldValidator(requestedFields, requiredFields);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(artist_id)) throw new Error("invalid request id");

        const albumExists = await Albums.findOne({ title, artist: artist_id, isDeleted: false });
        if (albumExists) throw new Error("album already exists");

        const newAlbum = await Albums.create({ title, artist: artist_id, release, coverImage: cover_image })
        if (!newAlbum) throw new Error("unable to create album");

        return {
            success: true,
            message: "album created",
            album: {
                album_id: newAlbum._id,
                title: newAlbum.title,
                artist_id: newAlbum.artist,
                release: newAlbum.release,
                cover_image: newAlbum.coverImage,
                created_at: newAlbum.createdAt
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
const getAlbum = async ({ album_id }) => {
    try {

        const isValid = fieldValidator({ album_id }, ["album_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(album_id)) throw new Error("invalid request id");

        const album = await Albums.findById(album_id);
        if (!album) throw new Error("album not found");

        return {
            success: true,
            message: "album fetched",
            album: {
                album_id: album._id,
                title: album.title,
                artist_id: album.artist,
                release: album.release,
                cover_image: album.coverImage,
                created_at: album.createdAt
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
const updateAlbum = async ({ album_id, title, artist_id, release, cover_image }) => {
    try {

        const requestedFields = { album_id, title, artist_id, release, cover_image };
        const requiredFields = ["album_id", "title", "artist_id", "release", "cover_image"];

        const isValid = fieldValidator(requestedFields, requiredFields);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(artist_id) || !isValidObjectId(album_id)) throw new Error("invalid request id");

        const updatedAlbum = await Albums.findByIdAndUpdate(album_id,
            { $set: { title, artist: artist_id, release, coverImage: cover_image } },
            { new: true });

        if (!updatedAlbum) throw new Error("album not found to update");

        return {
            success: true,
            message: "album updated",
            album: {
                album_id: updatedAlbum._id,
                title: updatedAlbum.title,
                artist_id: updatedAlbum.artist,
                release: updatedAlbum.release,
                cover_image: updatedAlbum.coverImage,
                created_at: updatedAlbum.createdAt
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
const deleteAlbum = async ({ album_id }) => {
    try {
        const isValid = fieldValidator({ album_id }, ["album_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(album_id)) throw new Error("invalid request id");

        const album = await Albums.findByIdAndUpdate(album_id, { $set: { isDeleted: true } }, { new: true });
        if (!album.isDeleted) throw new Error("album not found");

        return {
            success: true,
            message: "album deleted",
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error",
        }
    }
}
const listAlbumsByArtist = async ({ artist_id }) => {
    try {
        const isValid = fieldValidator({ artist_id }, ["artist_id"]);
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(artist_id)) throw new Error("invalid request id");

        const albums = await Albums.find({ artist: artist_id, isDeleted: false })

        return {
            success: true,
            message: "albums fetched",
            albums
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

module.exports = { createAlbum, getAlbum, updateAlbum, deleteAlbum, listAlbumsByArtist }