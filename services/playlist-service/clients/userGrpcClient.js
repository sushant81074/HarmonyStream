const grpc = require("@grpc/grpc-js")
const { loadProto } = require("../../../shared/protoLoader");
const { config } = require("dotenv");

config({ path: ".env" });
const USER_SERVICE_GRPC_URL = process.env.USER_SERVICE_GRPC_URL || "";

let userServiceClient = null;

const getUserServiceClient = () => {
    try {

        if (userServiceClient) return userServiceClient;
        if (!USER_SERVICE_GRPC_URL) throw new Error("user service grpc url not found");

        const proto = loadProto("user.proto");
        const UserService = proto.user.UserService;
        if (!UserService) throw new Error("UserService not found in loaded proto");

        const credentials = grpc.credentials.createInsecure();
        userServiceClient = new UserService(USER_SERVICE_GRPC_URL, credentials);

        return userServiceClient;
    } catch (error) {
        console.error("error occured", error.message);
        return error;
    }
}

module.exports = { userServiceClient, getUserServiceClient };