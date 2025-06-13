const { fieldValidator } = require("../../../shared/fieldValidator");
const { getCache } = require("../../../shared/redis");
const { createAccessAndRefreshToken } = require("../../../shared/tokenGenerator");
const Users = require("../schemas/user.schema");

const signUp = async ({ userName, avatar, email, password, confirmPassword, role }) => {
    try {
        const requestedFields = { userName, avatar, email, password, confirmPassword, role };
        const validFields = ["userName", "avatar", "email", "password", "confirmPassword", "role"]

        const isValid = fieldValidator(requestedFields, validFields);
        if (!isValid) throw new Error("Invalid Request Payload");

        password = password.trim();
        confirmPassword = confirmPassword.trim();

        if (password !== confirmPassword) throw new Error("Invalid Password and Confirm Password");

        const emailAlreadyExists = await Users.findOne({ email });
        if (emailAlreadyExists) throw new Error("Invalid Request Payload");

        const newUser = await Users.create({ email, userName, password, role, avatar });
        if (!newUser) throw new Error("Unable to Sign-Up");

        console.log({ newUser, msg: "new user created successfully" });
        return { user_id: newUser._id, success: true, message: "created" };

    } catch (error) {
        console.error("error occured:", error.message);
        return { user_id: null, success: false, message: error.message || "internal server error" };
    }
}
const signIn = async ({ email, password }) => {
    try {
        const requestedFields = { email, password };
        const validFields = ["email", "password"];

        const isValid = fieldValidator(requestedFields, validFields);
        if (!isValid) throw new Error("Invalid Request Payload");

        const userExists = await Users.findOne({ email, isDeleted: false });
        if (!userExists) throw new Error("User with Email Not Found");

        const isPasswordValid = await userExists.isPasswordValid(password);
        if (!isPasswordValid) throw new Error("Invalid Password");

        const { token, refreshToken } = await createAccessAndRefreshToken({ urId: userExists._id });
        if (!token || !refreshToken) throw new Error("Unable to Create Tokens")

        console.log({ msg: "tokens generated for user successfully", token, refreshToken });

        return { token, refresh_token: refreshToken, success: true, message: "sign-in successful" }

    } catch (error) {
        console.error("error occured:", error.message);
        return { token: null, refreshToken: null, success: false, message: error.message || "internal server error" }
    }
}
const verifyToken = async ({ token }) => {
    try {
        // we store user data / user id with token key 
        // if the token is expired we won't be able to get userid
        //  means session has been expired and user needs to login
        const requestedFields = { token };
        const validFields = ["token"];

        const isValid = fieldValidator(requestedFields, validFields);
        if (!isValid) throw new Error("Invalid Request Payload");

        const userId = await getCache(token);
        if (!userId) throw new Error("Session Expired");

        return { user_id: userId, is_valid: true, message: "success" }

    } catch (error) {
        console.error("error occured:", error.message);
        return { user_id: null, is_valid: false, message: error.message || "error" }
    }
}
const fetchUser = async ({ userId }) => {
    try {
        const requestedFields = { userId };
        const validFields = ["userId"];

        const isValid = fieldValidator(requestedFields, validFields);
        if (!isValid) throw new Error("Invalid Request Payload");

        const user = await Users.findOne({ _id: userId, isDeleted: false });
        if (!user) throw new Error("User with UserId Not Found");

        return { user_id: user._id, user_name: user.userName, email: user.email, avatar: user.avatar, created_at: user.createdAt, role: user.role };
    } catch (error) {
        console.error("error occured:", error.message);
        return { user_id: null, user_name: null, email: null, avatar: null, created_at: null, role: null }
    }
}
const updateUser = async ({ userId, userName, avatar }) => {
    try {
        const requestedFields = { userId, userName, avatar };
        const validFields = ["userId", "userName", "avatar"];

        const isValid = fieldValidator(requestedFields, validFields);
        if (!isValid) throw new Error("Invalid Request Payload");

        const updatedUser = await Users.findOneAndUpdate({ _id: userId, isDeleted: false }, { $set: { userName, avatar } }, { new: true });
        if (!updatedUser || updatedUser.userName !== userName) throw new Error("User with UserId Not Found to Update");

        return { success: true, message: "updated" }
    } catch (error) {
        console.error("error occured:", error.message);
        return { success: false, message: error.message || "internal server error" }
    }
}
const deleteUser = async ({ userId }) => {
    try {
        const requestedFields = { userId };
        const validFields = ["userId"];

        const isValid = fieldValidator(requestedFields, validFields);
        if (!isValid) throw new Error("Invalid Request Payload");

        const user = await Users.findByIdAndUpdate(userId, { $set: { isDeleted: true } }, { new: true });
        if (!user) throw new Error("User with UserId Not Found to Delete");

        return { success: true, message: "deleted" }
    } catch (error) {
        console.error("error occured:", error.message);
        return { success: true, message: error.message || "internal server error" }
    }
}

module.exports = { signIn, signUp, verifyToken, fetchUser, updateUser, deleteUser }