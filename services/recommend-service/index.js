const express = require("express")
const cors = require("cors")
const grpc = require("@grpc/grpc-js")
const { config } = require("dotenv")
const healthRouter = require("./routes/health.routes.js")
const { loadProto } = require("../../shared/protoLoader.js")
const { recommendGrpcObject } = require("./grpc/recommend.grpc.js")

config({ path: ".env" })

const PORT = process.env.PORT || 3002;
const GRPC_PORT = process.env.GRPC_PORT || "0.0.0.0:50052";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }))

app.use("/", healthRouter.router);

app.listen(PORT, () => {
    console.log("✅ Recommendation-service running on port:", PORT);
});

const recommendPackage = loadProto("recommend.proto").recommend;
const grpcServer = new grpc.Server();

grpcServer.addService(recommendPackage.RecommendService.service, recommendGrpcObject)

grpcServer.bindAsync(
    `${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => err ? console.error(`❌ gRPC server error occured`, err) :
        console.log(`✅ gRPC server running on port: ${GRPC_PORT}`)
)