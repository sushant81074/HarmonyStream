const { search } = require('../../controllers/app/search.controller');
const { auth } = require('../../middlewares/auth');

const router = require('express').Router();

router.use(auth);
router.get(["/artists", "/albums", "/tracks", "/all",], search)

module.exports = { router }