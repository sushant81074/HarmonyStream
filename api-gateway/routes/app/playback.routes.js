const { playTrack, getPlaybackState, getPlayHistory, getQueue, addTrackToQueue, removeTrackFromQueue, clearQueue, pauseTrack, resumeTrack, stopPlayback } = require('../../controllers/app/playback.controller');

const router = require('express').Router();

router.get("/state", getPlaybackState)
    .get("/history", getPlayHistory);


router.post("/play", playTrack)
    .patch("/:id/pause", pauseTrack)
    .patch("/:id/resume", resumeTrack)
    .patch("/:id/stop", stopPlayback);

// Track Queue
router.route("/queue")
    .get(getQueue)
    .post(addTrackToQueue);

router.patch("/queue/:id/clear", clearQueue);
router.patch("/queue/:id/remove", removeTrackFromQueue);


module.exports = { router }