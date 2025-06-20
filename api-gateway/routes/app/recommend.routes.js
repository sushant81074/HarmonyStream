const { recommendations } = require('../../controllers/app/recommend.controller');

const router = require('express').Router();

router.get(["/personal", "/general"], recommendations)

module.exports = { router }