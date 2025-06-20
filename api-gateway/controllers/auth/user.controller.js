const { fieldValidator } = require("../../../shared/fieldValidator");
const { getUserServiceClient } = require("../../utils/loadProtoClients");

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isValid = fieldValidator({ email, password }, ["email", "password"]);
        if (!isValid) throw new Error("invalid payload");

        const userService = getUserServiceClient();
        if (!userService) throw new Error("unable to connect with user-service");

        const resp = await new Promise((resolve, reject) => {
            userService.SignIn({ email, password }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        if (!resp || !resp.success) return res.status(401).json({ success: false, message: resp.message });

        return res.status(200).json({
            success: true,
            message: resp.message,
            token: resp.token,
            refreshToken: resp.refresh_token // Use refreshToken as per proto
        });
    } catch (error) {
        console.error("error occured during signIn", error.message);
        return res.status(500).json({ success: false, message: error.message || 'Internal server error during signIn' });
    }

}
const signUp = async (req, res) => {
    try {
        const { email, password, name, confirm, avatar, role } = req.body;

        const isValid = fieldValidator({ email, password, name, confirm, avatar, role }, ["email", "password", "name", "confirm", "avatar", "role"]);
        if (!isValid) throw new Error("invalid payload");

        const userService = getUserServiceClient();
        if (!userService) throw new Error("unable to connect with user-service");

        const resp = await new Promise((resolve, reject) => {
            userService.SignUp({ email, password, user_name: name, confirm_password: confirm, avatar, role }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        if (!resp || resp.success) return res.status(401).json({ success: false, message: resp.message });

        return res.status(200).json({
            success: true,
            message: resp.message,
            userId: resp.user_id // Use refreshToken as per proto
        });

    } catch (error) {
        console.error("error occured during signIn", error.message);
        return res.status(500).json({ success: false, message: error.message || 'Internal server error during signUp' });
    }
}

module.exports = { signIn, signUp }