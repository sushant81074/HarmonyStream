const { Router } = require("express");

const router = Router();

router.get("/", (_, res) => {
    res.send({ status: true, message: "🌚 playback-session-service says hiii!!!🌚" });
})
router.get('/health', (_, res) => {
    res.send({ status: true, message: "playback-session-service running" });
});

module.exports = { router };