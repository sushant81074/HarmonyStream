const { streamTrack } = require('../controllers/stream.controller');

const router = require('express').Router();

router.route("/:trackId").get(streamTrack)

module.exports = { router }