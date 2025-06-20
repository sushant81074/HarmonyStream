const { auth } = require('../../middlewares/auth');

const router = require('express').Router();

router
    .get("/artists")
    .get("/albums")
    .get("/tracks")
    .get("/all")

module.exports = { router }