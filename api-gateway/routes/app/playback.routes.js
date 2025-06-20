const router = require('express').Router();

router.route("/").post().get().patch().delete()

router.get("/list")
    .post("/add")       //add track to playlist
    .patch("/remove")   //remove track to playlist
    .patch("/re-order") //reorder tracks in playlist

module.exports = { router }