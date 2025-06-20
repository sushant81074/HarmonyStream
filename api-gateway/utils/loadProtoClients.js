const grpc = require("@grpc/grpc-js");
const path = require("path");
const grpcProtoLoader = require("@grpc/proto-loader");

const PROTO_DIR = path.join(__dirname, "../proto");

const PROTO_DEFINATIONS = {};
const GRPC_CLIENTS = {};

const loadProto = (filename) => {
    if (PROTO_DEFINATIONS[filename]) return PROTO_DEFINATIONS[filename];

    const protoPath = path.join(PROTO_DIR, filename);
    const packageDefination = grpcProtoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [PROTO_DIR]
    })
    const proto = grpc.loadPackageDefinition(packageDefination);

    PROTO_DEFINATIONS[filename] = proto;
    console.log(`proto defination loaded for: ${filename}`);
    return proto;
}

const getGrpcClient = (servicename, filename, grpcenvurl, packagename) => {
    if (GRPC_CLIENTS[servicename]) return GRPC_CLIENTS[servicename];

    const grpcUrl = process.env[grpcenvurl];
    if (!grpcUrl) console.error("error env variables not found");

    try {
        const proto = loadProto(filename);

        const Service = proto[packagename][servicename];
        const client = new Service(grpcUrl, grpc.credentials.createInsecure());
        if (!client) console.error("unable to connect with grpc client");

        GRPC_CLIENTS[servicename] = client;
        return client;
    } catch (error) {
        console.error("error occured", error.message);
        return error;
    }
}

const getUserServiceClient = () => getGrpcClient('UserService', 'user.proto', 'USER_GRPC_PORT', 'user');
const getContentServiceClient = () => getGrpcClient('ContentService', 'content.proto', 'CONTENT_GRPC_PORT', 'content');
const getPlaylistServiceClient = () => getGrpcClient('PlaylistService', 'playlist.proto', 'PLAYLIST_GRPC_PORT', 'playlist');
const getPlaybackServiceClient = () => getGrpcClient('PlaybackService', 'playback.proto', 'PLAYBACK_GRPC_PORT', 'playback');
const getSearchServiceClient = () => getGrpcClient('SearchService', 'search.proto', 'SEARCH_GRPC_PORT', 'search');
const getRecommendationServiceClient = () => getGrpcClient('RecommendService', 'recommend.proto', 'RECOMMEND_GRPC_PORT', 'recommend');

module.exports = {
    getUserServiceClient,
    getContentServiceClient,
    getPlaybackServiceClient,
    getPlaylistServiceClient,
    getSearchServiceClient,
    getRecommendationServiceClient
}