const { Router } = require("express");

const router = Router();

router.get("/", (_, res) => {
    res.send({ status: true, message: "🌚 search-service says hiii!!!🌚" });
})
router.get('/health', (_, res) => {
    res.send({ status: true, message: "search-service running" });
});

module.exports = { router };