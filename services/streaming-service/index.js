const express = require("express");
const { config } = require("dotenv");
const { router: healthRouter } = require("./routes/health.routes");
const { router: streamRouter } = require("./routes/stream.routes");
config({ path: ".env" });

const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRouter);
app.use("/stream", streamRouter)

app.listen(PORT, () => console.log("✅ User service running on port:", PORT));

// TODO: must complete after api gateway is done