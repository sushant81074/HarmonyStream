const { signIn, signUp } = require('../../controllers/auth/user.controller');

const router = require('express').Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

module.exports = { router }