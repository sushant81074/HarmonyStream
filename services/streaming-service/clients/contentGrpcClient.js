const grpc = require("@grpc/grpc-js")
const { loadProto } = require("../../../shared/protoLoader");
const { config } = require("dotenv");

config({ path: ".env" });

const CONTENT_SERVICE_GRPC_URL = process.env.CONTENT_SERVICE_GRPC_URL || "";
let contentServiceClient = null;

const getContentServiceClient = () => {
    try {
        if (contentServiceClient) return contentServiceClient;
        if (!CONTENT_SERVICE_GRPC_URL) throw new Error("content service url not found");

        const proto = loadProto("content.proto");
        const ContentService = proto.content.ContentService;
        if (!ContentService) throw new Error("ContentService not found in loaded proto");

        const credentials = grpc.credentials.createInsecure();
        contentServiceClient = new ContentService(CONTENT_SERVICE_GRPC_URL, credentials);

        return contentServiceClient;
    } catch (error) {
        console.error("error occured", error.message);
        return error;
    }
}

module.exports = { contentServiceClient, getContentServiceClient }