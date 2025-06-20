const router = require('express').Router();

router.route("/artists/:id").get().patch().delete()
router.route("/albums").get().patch().delete()
router.route("/tracks").get().patch().delete()

router.post("/artists")
    .post("/albums")
    .post("/tracks")


router.get("/artists/all")
    .get("/albums/all")
    .get("/tracks/all")

module.exports = { router }