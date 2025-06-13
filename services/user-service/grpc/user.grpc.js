const { signUp, signIn, verifyToken, fetchUser, updateUser, deleteUser } = require("../controllers/user.controller");

const userGrpcObject = {
    SignUp: async (call, callBack) => {
        const { user_name, avatar, email, password, confirm_password, role } = call.request;
        const res = await signUp({ userName: user_name, confirmPassword: confirm_password, avatar, email, password, role })
        callBack(null, res);
    },
    SignIn: async (call, callBack) => {
        const { email, password } = call.request;
        const res = await signIn({ email, password });
        callBack(null, res)
    },
    VerifyToken: async (call, callBack) => {
        const { token } = call.request;
        const res = await verifyToken({ token })
        callBack(null, res)
    },
    GetUserById: async (call, callBack) => {
        const { user_id } = call.request;
        const res = await fetchUser({ userId: user_id })
        callBack(null, res);
    },
    UpdateUserProfile: async (call, callBack) => {
        const { user_id, user_name, avatar } = call.request;
        const res = await updateUser({ userId: user_id, userName: user_name, avatar })
        callBack(null, res);
    },
    DeleteUser: async (call, callBack) => {
        const { user_id } = call.request;
        const res = await deleteUser({ userId: user_id })
        callBack(null, res);
    }
}
module.exports = { userGrpcObject }