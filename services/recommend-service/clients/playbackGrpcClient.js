const grpc = require("@grpc/grpc-js");
const { loadProto } = require('../../../shared/protoLoader');
const { config } = require("dotenv");

config({ path: ".env" });

const PLAYBACK_SERVICE_GRPC_URL = process.env.PLAYBACK_SERVICE_GRPC_URL || "";
let playbackServiceClient = null;

const getPlaybackServiceClient = () => {
    try {
        if (playbackServiceClient) return playbackServiceClient;
        if (!PLAYBACK_SERVICE_GRPC_URL) throw new Error("playback service url not found");

        const proto = loadProto("playback.proto");
        const PlaybackService = proto.playback.PlaybackService;
        if (!PlaybackService) throw new Error("PlaybackService not found in loaded proto");

        const credentials = grpc.credentials.createInsecure();
        playbackServiceClient = new PlaybackService(PLAYBACK_SERVICE_GRPC_URL, credentials);

        return playbackServiceClient;

    } catch (error) {
        console.error("error occured:", error.message);
        return error;
    }
}

module.exports = { getPlaybackServiceClient, playbackServiceClient };