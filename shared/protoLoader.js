// shared/protoLoader.ts
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const loadProto = (filename) => {
    const PROTO_PATH = path.resolve(__dirname, `../proto/${filename}`);

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    return grpc.loadPackageDefinition(packageDefinition);
};

module.exports = { loadProto }