const { createPlaylist, getPlaylist, updatePlaylist, deletePlaylist, listUserPlaylists, addTrackToPlaylist, removeTrackFromPlaylist, reorderTracksInPlaylist } = require("../controllers/playlist.controller");

const playlistGrpcObject = {
    CreatePlaylist: async (call, callBack) => {
        const res = await createPlaylist(call.request);
        callBack(null, res);
    },
    GetPlaylist: async (call, callBack) => {
        const res = await getPlaylist(call.request);
        callBack(null, res);
    },
    UpdatePlaylist: async (call, callBack) => {
        const res = await updatePlaylist(call.request);
        callBack(null, res);
    },
    DeletePlaylist: async (call, callBack) => {
        const res = await deletePlaylist(call.request);
        callBack(null, res);
    },
    ListUserPlaylists: async (call, callBack) => {
        const res = await listUserPlaylists(call.request);
        callBack(null, res);
    },
    AddTrackToPlaylist: async (call, callBack) => {
        const res = await addTrackToPlaylist(call.request);
        callBack(null, res);
    },
    RemoveTrackFromPlaylist: async (call, callBack) => {
        const res = await removeTrackFromPlaylist(call.request);
        callBack(null, res);
    },
    ReorderTracksInPlaylist: async (call, callBack) => {
        const res = await reorderTracksInPlaylist(call.request);
        callBack(null, res);
    }
}

module.exports = { playlistGrpcObject }