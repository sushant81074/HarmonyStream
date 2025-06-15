const express = require("express")
const grpc = require("@grpc/grpc-js")
const { config } = require("dotenv")
const healthRouter = require("./routes/health.routes.js")
const { loadProto } = require("../../shared/protoLoader.js")
const { dbConnect } = require("./db/dbConnect.js")
const { redisConnect } = require("../../shared/redis.js")
const { contentGrpcObject } = require("./grpc/content.grpc.js")

config({ path: ".env" })

const PORT = process.env.PORT || 3003;
const GRPC_PORT = process.env.GRPC_PORT || "0.0.0.0:50053";

redisConnect();
dbConnect();

const app = express();
app.use(express.json());

app.use("/", healthRouter.router);

app.listen(PORT, () => {
    console.log("✅ Content service running on port:", PORT);
});

const contentPackage = loadProto("content.proto").content;
const grpcServer = new grpc.Server();

grpcServer.addService(contentPackage.ContentService.service, contentGrpcObject)

grpcServer.bindAsync(
    `${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => err ? console.error(`❌ gRPC server error occured`, err) :
        console.log(`✅ gRPC server running on port: ${GRPC_PORT}`)
)