const { isValidObjectId } = require("mongoose");
const { fieldValidator } = require("../../../shared/fieldValidator");
const Playlists = require("../schemas/playlist.schema");
const { getUserServiceClient } = require("../clients/userGrpcClient");
const { getContentServiceClient } = require("../clients/contentGrpcClient");

const createPlaylist = async ({ title, description, user_id, is_public }) => {
    try {
        const requestedFields = { title, description, user_id, is_public };
        const requiredFields = ["title", "description", "user_id", "is_public"]

        const isValid = fieldValidator(requestedFields, requiredFields);
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        const userService = getUserServiceClient();
        if (userService instanceof Error) throw new Error("unable to connect with user-service");

        const userExists = await new Promise((resolve, reject) => {
            userService.GetUserById({ user_id }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        });
        if (!userExists) throw new Error("user with id not found");

        const playlistExists = await Playlists.findOne({ title, user: user_id });
        if (playlistExists) throw new Error("playlist already exists");

        const newPlaylist = await Playlists.create({ title, description, user: user_id, isPublic: is_public });
        if (!newPlaylist) throw new Error("unable to create new playlist");

        return {
            message: "playlist created",
            success: true,
            playlist: {
                playlist_id: newPlaylist._id,
                title: newPlaylist.title,
                description: newPlaylist.description,
                user_id: newPlaylist.user,
                track_ids: newPlaylist.tracks,
                is_public: newPlaylist.isPublic,
                is_deleted: newPlaylist.isDeleted,
                created_at: newPlaylist.createdAt,
                updated_at: newPlaylist.updatedAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            message: error.message || "internal server error",
            success: false,
            playlist: {}
        }
    }
}
const getPlaylist = async ({ playlist_id }) => {
    try {
        const isValid = fieldValidator({ playlist_id }, ["playlist_id"]);
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(playlist_id)) throw new Error("invalid request id");

        const playlist = await Playlists.findById(playlist_id);
        if (!playlist || playlist.isDeleted) throw new Error("playlist not found");

        return {
            message: "playlist fetched",
            success: true,
            playlist: {
                playlist_id: playlist._id,
                title: playlist.title,
                description: playlist.description,
                user_id: playlist.user,
                track_ids: playlist.tracks,
                is_public: playlist.isPublic,
                is_deleted: playlist.isDeleted,
                created_at: playlist.createdAt,
                updated_at: playlist.updatedAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            message: error.message || "internal server error",
            success: false,
            playlist: {}
        }
    }
}
const updatePlaylist = async ({ playlist_id, title, description, is_public }) => {
    try {
        const isValid = fieldValidator(
            { playlist_id, title, description, is_public },
            ["playlist_id", "title", "description", "is_public"]
        );
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(playlist_id)) throw new Error("invalid request id");

        const playlist = await Playlists.findByIdAndUpdate(playlist_id, {
            $set: { title, description, isPublic: is_public }
        }, { new: true });
        if (!playlist) throw new Error("playlist not found to update");

        return {
            message: "playlist updated",
            success: true,
            playlist: {
                playlist_id: playlist._id,
                title: playlist.title,
                description: playlist.description,
                user_id: playlist.user,
                track_ids: playlist.tracks,
                is_public: playlist.isPublic,
                is_deleted: playlist.isDeleted,
                created_at: playlist.createdAt,
                updated_at: playlist.updatedAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            message: error.message || "internal server error",
            success: false,
            playlist: {}
        }
    }
}
const deletePlaylist = async ({ playlist_id }) => {
    try {
        const isValid = fieldValidator({ playlist_id }, ["playlist_id"]);
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(playlist_id)) throw new Error("invalid request id");

        const playlist = await Playlists.findByIdAndUpdate(playlist_id, { $set: { isDeleted: true } }, { new: true });
        if (!playlist.isDeleted) throw new Error("playlist not found");

        return {
            message: "playlist deleted",
            success: true,
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            message: error.message || "internal server error",
            success: false,
            playlist: {}
        }
    }
}
const listUserPlaylists = async ({ user_id }) => {
    try {

        const isValid = fieldValidator({ user_id }, ["user_id"]);
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        let playlists = await Playlists.find({ user: user_id, isDeleted: false });
        if (!Array.isArray(playlists) || !playlists.length) playlists = [];

        return {
            message: "playlist fetched",
            success: true,
            playlists: playlists.map((playlist) => {
                return {
                    playlist_id: playlist._id,
                    title: playlist.title,
                    description: playlist.description,
                    user_id: playlist.user,
                    track_ids: playlist.tracks,
                    is_public: playlist.isPublic,
                    is_deleted: playlist.isDeleted,
                    created_at: playlist.createdAt,
                    updated_at: playlist.updatedAt,
                }
            })
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            message: error.message || "internal server error",
            success: false,
            playlists: []
        }
    }
}
const addTrackToPlaylist = async ({ playlist_id, track_id }) => {
    try {

        const isValid = fieldValidator({ playlist_id, track_id }, ["playlist_id", "track_id"]);
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(playlist_id) || !isValidObjectId(track_id)) throw new Error("invalid request id");

        const contentService = getContentServiceClient();
        if (contentService instanceof Error) throw new Error("unable to connect with content-service");

        const trackExists = await new Promise((resolve, reject) => {
            contentService.GetTrack({ track_id }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        });
        if (!trackExists) throw new Error("track with id not found")


        const playlist = await Playlists.findByIdAndUpdate(playlist_id,
            { $addToSet: { tracks: track_id } },
            { new: true });

        if (!playlist) throw new Error("playlist not found");

        return {
            message: "track added",
            success: true,
            playlist: {
                playlist_id: playlist._id,
                title: playlist.title,
                description: playlist.description,
                user_id: playlist.user,
                track_ids: playlist.tracks,
                is_public: playlist.isPublic,
                is_deleted: playlist.isDeleted,
                created_at: playlist.createdAt,
                updated_at: playlist.updatedAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            message: error.message || "internal server error",
            success: false,
            playlist: {}
        }
    }
}
const removeTrackFromPlaylist = async ({ playlist_id, track_id }) => {
    try {

        const isValid = fieldValidator({ playlist_id, track_id }, ["playlist_id", "track_id"]);
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(playlist_id) || !isValidObjectId(track_id)) throw new Error("invalid request id");

        const playlist = await Playlists.findByIdAndUpdate(playlist_id,
            { $pull: { tracks: track_id } },
            { new: true });

        if (!playlist) throw new Error("playlist not found");

        return {
            message: "track removed",
            success: true,
            playlist: {
                playlist_id: playlist._id,
                title: playlist.title,
                description: playlist.description,
                user_id: playlist.user,
                track_ids: playlist.tracks,
                is_public: playlist.isPublic,
                is_deleted: playlist.isDeleted,
                created_at: playlist.createdAt,
                updated_at: playlist.updatedAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            message: error.message || "internal server error",
            success: false,
            playlist: {}
        }
    }
}
const reorderTracksInPlaylist = async ({ playlist_id, track_old_index, track_new_index }) => {
    try {

        const isValid = fieldValidator({ playlist_id, track_old_index, track_new_index }, ["playlist_id", "track_old_index", "track_new_index"]);
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(playlist_id)) throw new Error("invalid request id");

        const playlist = await Playlists.findById(playlist_id);
        if (!playlist) throw new Error("playlist not found")

        const length = playlist.tracks.length;
        if (track_old_index < 0 || track_old_index >= length || track_new_index < 0 || track_new_index >= length)
            throw new Error("index out of range");


        const trackId = playlist.tracks[track_new_index]
        playlist.tracks[track_new_index] = playlist.tracks[track_old_index];
        playlist.tracks[track_old_index] = trackId;

        await playlist.save();

        return {
            message: "playlist reordered",
            success: true,
            playlist: {
                playlist_id: playlist._id,
                title: playlist.title,
                description: playlist.description,
                user_id: playlist.user,
                track_ids: playlist.tracks,
                is_public: playlist.isPublic,
                is_deleted: playlist.isDeleted,
                created_at: playlist.createdAt,
                updated_at: playlist.updatedAt,
            }
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            message: error.message || "internal server error",
            success: false,
            playlist: {}
        }
    }
}

module.exports = {
    createPlaylist,
    getPlaylist,
    updatePlaylist,
    deletePlaylist,
    listUserPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderTracksInPlaylist
}