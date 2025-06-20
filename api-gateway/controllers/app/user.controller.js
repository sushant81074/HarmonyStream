const { getUserServiceClient } = require("../../utils/loadProtoClients");

const handleGrpcCall = async (res, serviceCallPromise) => {
    try {
        const result = await serviceCallPromise;
        return res.status(200).send(result);
    } catch (error) {
        console.error("error:", error.message);
        return res.status(500).send(error.message);
    }
}

const fetchUser = async (req, res) => {
    const userService = getUserServiceClient();
    const { id } = req.query;
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        userService.GetUserById({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}

const updateUser = async (req, res) => {
    const userService = getUserServiceClient();
    const { name, avatar } = req.body;
    const { id } = req.params;
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        userService.UpdateUserProfile({ user_id: id, user_name: name, avatar }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}

const deleteUser = async (req, res) => {
    const userService = getUserServiceClient();
    const { id } = req.params;
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        userService.DeleteUser({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}

module.exports = { fetchUser, updateUser, deleteUser }