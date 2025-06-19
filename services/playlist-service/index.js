const express = require("express")
const cors = require("cors")
const grpc = require("@grpc/grpc-js")
const { config } = require("dotenv")
const healthRouter = require("./routes/health.routes.js")
const { loadProto } = require("../../shared/protoLoader.js")
const { dbConnect } = require("./db/dbConnect.js")
const { redisConnect } = require("../../shared/redis.js")
const { playlistGrpcObject } = require("./grpc/playlist.grpc.js")

config({ path: ".env" })

const PORT = process.env.PORT || 3003;
const GRPC_PORT = process.env.GRPC_PORT || "0.0.0.0:50053";

redisConnect();
dbConnect();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }))

app.use("/", healthRouter.router);

app.listen(PORT, () => {
    console.log("✅ Playlist service running on port:", PORT);
});

const playlistPackage = loadProto("playlist.proto").playlist;
const grpcServer = new grpc.Server();

grpcServer.addService(playlistPackage.PlaylistService.service, playlistGrpcObject)

grpcServer.bindAsync(
    `${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => err ? console.error(`❌ gRPC server error occured`, err) :
        console.log(`✅ gRPC server running on port: ${GRPC_PORT}`)
)