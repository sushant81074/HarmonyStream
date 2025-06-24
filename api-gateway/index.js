const express = require("express");
const cors = require('cors');
const { config } = require('dotenv');
const { router: authRouter } = require("./routes/auth/auth.route");
const { router: userRouter } = require("./routes/app/user.routes");
const { router: searchRouter } = require("./routes/app/search.routes");
const { router: recommendationRouter } = require("./routes/app/recommend.routes");
const { router: contentRouter } = require("./routes/app/content.routes");
const { router: playlistRouter } = require("./routes/app/playlist.routes");
const { router: playbackRouter } = require("./routes/app/playback.routes");

const app = express();
config({ path: ".env" });

const PORT = process.env.PORT || 3007;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public routes
app.use("/api/v1/auth", authRouter);
// protected routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/recommendations", recommendationRouter);
app.use("/api/v1/contents", contentRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/playbacks", playbackRouter);

app.listen(PORT, () => console.log("api-gateway running on port:", PORT));