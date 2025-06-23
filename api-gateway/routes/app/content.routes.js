const router = require('express').Router();

const {
    createArtist,
    getArtist,
    updateArtist,
    deleteArtist,
    listArtists,
    createAlbum,
    getAlbum,
    updateAlbum,
    deleteAlbum,
    listAlbumsByArtist,
    createTrack,
    getTrack,
    updateTrack,
    deleteTrack,
    listTracksByAlbum,
    listMostPlayedTracks,
    incrementTrackPlayCount
} = require('../../controllers/app/content.controller'); // update path as needed

// Artists
router.route("/artists")
    .get(getArtist)
    .post(createArtist);

router.get("/artists/all", listArtists);

router.patch("/artists/:id", updateArtist)
    .patch("/artists/:id/delete", deleteArtist);

// Albums
router
    .route("/albums")
    .post(createAlbum)
    .get(getAlbum);

// all albums for an artist (assumes filter by artist in controller)
router.get("/albums/all", listAlbumsByArtist);

router.patch("/albums/:id", updateAlbum)
    .patch("/albums/:id/delete", deleteAlbum);

// Tracks
router.route("/tracks")
    .get(getTrack)
    .post(createTrack);

// all tracks in an album
router.get("/tracks/all", listTracksByAlbum);

router.patch("/tracks/:id", updateTrack)
    .patch("/tracks/:id/delete", deleteTrack);

// Extra routes
router.get("/tracks/most-played", listMostPlayedTracks);
router.patch("/tracks/:id/inc", incrementTrackPlayCount);

module.exports = { router };
