const {
    createPlaylist,
    fetchPlaylist,
    updatePlaylist,
    deletePlaylist,
    fetchUserPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderTracksInPlaylist
} = require('../../controllers/app/playlist.controller');

const router = require('express').Router();

router
    .route("/")
    .post(createPlaylist)
    .get(fetchPlaylist);

router
    .get("/all", fetchUserPlaylists)
    .patch("/add", addTrackToPlaylist)       //add track to playlist
    .patch("/remove", removeTrackFromPlaylist)   //remove track to playlist
    .patch("/re-order", reorderTracksInPlaylist) //reorder tracks in playlist
    .patch("/:id", updatePlaylist)
    .patch("/:id/delete", deletePlaylist)


module.exports = { router }