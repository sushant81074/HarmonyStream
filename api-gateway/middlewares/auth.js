const { getUserServiceClient } = require("../utils/loadProtoClients");

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw new Error("token is required");

        const userService = getUserServiceClient();
        if (userService instanceof Error) throw new Error("unable to connect with user-service");

        const res = await new Promise((resolve, reject) => {
            userService.VerifyToken({ token }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        if (!res || !res.is_valid) throw new Error("invalid token or token has been expired");

        next();
    } catch (error) {
        console.error("error occured:", error.message);
        next(error);
    }
}

module.exports = { auth }