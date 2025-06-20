const { fetchUser, updateUser, deleteUser } = require('../../controllers/app/user.controller');
const { } = require('../../controllers/auth/user.controller');
const { auth } = require('../../middlewares/auth');

const router = require('express').Router();

router.use(auth);
router.get("/", fetchUser) // get
    .patch("/:id", updateUser) // update
    .patch("/:id/delete", deleteUser) // delete

module.exports = { router }