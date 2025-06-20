const { getPlaylistServiceClient } = require("../../utils/loadProtoClients");

const handleGrpcCall = async (res, serviceCallPromise) => {
    try {
        const result = await serviceCallPromise;
        return res.status(200).send(result);
    } catch (error) {
        console.error("error:", error.message);
        return res.status(500).send(error.message);
    }
}

const createPlaylist = async (req, res) => {
    const { id, title, description, isPublic } = req.body;
    const playlistService = getPlaylistServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playlistService.CreatePlaylist({ user_id: id, title, description, is_public: isPublic }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const fetchPlaylist = async (req, res) => {
    const { id } = req.query;
    const playlistService = getPlaylistServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playlistService.GetPlaylist({ playlist_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const { title, description, isPublic } = req.body;
    const playlistService = getPlaylistServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playlistService.UpdatePlaylist({ playlist_id: id, title, description, is_public: isPublic }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const deletePlaylist = async (req, res) => {
    const { id } = req.params;
    const playlistService = getPlaylistServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playlistService.DeletePlaylist({ playlist_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const fetchUserPlaylists = async (req, res) => {
    const { id } = req.query;
    const playlistService = getPlaylistServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playlistService.ListUserPlaylists({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const addTrackToPlaylist = async (req, res) => {
    const { pId, tId } = req.body;
    const playlistService = getPlaylistServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playlistService.AddTrackToPlaylist({ playlist_id: pId, track_id: tId }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const removeTrackFromPlaylist = async (req, res) => {
    const { pId, tId } = req.body;
    const playlistService = getPlaylistServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playlistService.RemoveTrackFromPlaylist({ playlist_id: pId, track_id: tId }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const reorderTracksInPlaylist = async (req, res) => {
    const { id, oIdx, nIdx } = req.body;
    const playlistService = getPlaylistServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playlistService.ReorderTracksInPlaylist({ playlist_id: id, track_old_index: oIdx, track_new_index: nIdx }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}

module.exports = {
    createPlaylist,
    fetchPlaylist,
    updatePlaylist,
    deletePlaylist,
    fetchUserPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderTracksInPlaylist
}