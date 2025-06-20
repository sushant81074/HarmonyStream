const { signUp, signIn, verifyToken, fetchUser, updateUser, deleteUser } = require("../controllers/user.controller");

const userGrpcObject = {
    SignUp: async (call, callBack) => {
        const res = await signUp(call.request);
        console.log(res);
        callBack(null, res);
    },
    SignIn: async (call, callBack) => {
        const res = await signIn(call.request);
        console.log(res);
        callBack(null, res)
    },
    VerifyToken: async (call, callBack) => {
        const res = await verifyToken(call.request);
        callBack(null, res)
    },
    GetUserById: async (call, callBack) => {
        const res = await fetchUser(call.request);
        callBack(null, res);
    },
    UpdateUserProfile: async (call, callBack) => {
        const res = await updateUser(call.request);
        callBack(null, res);
    },
    DeleteUser: async (call, callBack) => {
        const res = await deleteUser(call.request);
        callBack(null, res);
    }
}
module.exports = { userGrpcObject }