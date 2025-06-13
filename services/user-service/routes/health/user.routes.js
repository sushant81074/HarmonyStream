const { Router } = require("express");
const { signUp, signIn, updateUser, fetchUser, deleteUser } = require("../../controllers/user.controller");

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.use("/").get(fetchUser).patch(updateUser).delete(deleteUser);

module.exports = { router };