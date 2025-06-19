const express = require("express")
const cors = require("cors")
const grpc = require("@grpc/grpc-js")
const { config } = require("dotenv")
const healthRouter = require("./routes/health.routes.js")
const { loadProto } = require("../../shared/protoLoader.js")
const { searchGrpcObject } = require("./grpc/search.grpc.js")

config({ path: ".env" })

const PORT = process.env.PORT || 3005;
const GRPC_PORT = process.env.GRPC_PORT || "0.0.0.0:50055";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }))

app.use("/", healthRouter.router);

app.listen(PORT, () => {
    console.log("✅ Search service running on port:", PORT);
});

const searchPackage = loadProto("search.proto").search;
const grpcServer = new grpc.Server();

grpcServer.addService(searchPackage.SearchService.service, searchGrpcObject)

grpcServer.bindAsync(
    `${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => err ? console.error(`❌ gRPC server error occured`, err) :
        console.log(`✅ gRPC server running on port: ${GRPC_PORT}`)
)