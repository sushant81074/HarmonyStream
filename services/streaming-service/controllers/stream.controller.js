
const fs = require('fs');
const path = require('path');
const { getContentServiceClient } = require('../clients/contentGrpcClient');

const AUDIO_FILES_BASE_PATH = process.env.AUDIO_FILES_BASE_PATH || './audio_files';

const streamTrack = async (req, res) => {
    const { trackId } = req.params; // Get trackId from URL parameter

    try {
        if (!trackId) {
            return res.status(400).send("Track ID is required.");
        }

        const contentService = getContentServiceClient();

        // 1. Get track details from Content Service to find audio_url
        const trackResponse = await new Promise((resolve, reject) => {
            contentService.GetTrack({ id: trackId }, (error, response) => {
                if (error) {
                    console.error(`gRPC error from Content Service (GetTrack) for track ${trackId}: ${error.details}`);
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });

        if (!trackResponse.success || !trackResponse.track || !trackResponse.track.audioUrl) {
            console.warn(`Audio URL not found for track ID: ${trackId}`);
            return res.status(404).send("Track audio not found.");
        }

        // The audioUrl is expected to be a filename (e.g., "song.mp3")
        const fileName = trackResponse.track.audioUrl;
        const filePath = path.join(AUDIO_FILES_BASE_PATH, fileName);

        // 2. Check if the file exists
        if (!fs.existsSync(filePath)) {
            console.error(`Audio file not found at path: ${filePath}`);
            return res.status(404).send("Audio file not found on streaming server.");
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        // 3. Handle Range Requests (for streaming/seeking)
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize) { // Requesting beyond file size
                res.status(416).set({
                    'Content-Range': `bytes */${fileSize}`,
                    'Accept-Ranges': 'bytes'
                }).end();
                return;
            }

            const chunksize = (end - start) + 1;
            const fileStream = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg', // Assuming MP3. Adjust for other formats (e.g., audio/wav)
            };

            res.writeHead(206, head); // 206 Partial Content
            fileStream.pipe(res);

            console.info(`Streaming track ${trackId} (partial content: ${start}-${end}/${fileSize})`);
        } else {
            // 4. Handle Full File Request (if no range header)
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg', // Assuming MP3.
            };
            res.writeHead(200, head); // 200 OK
            fs.createReadStream(filePath).pipe(res);

            console.info(`Streaming track ${trackId} (full content)`);
        }

    } catch (error) {
        console.error(`Error streaming track ${trackId}: ${error.message}`);
        // Map gRPC errors from Content Service to appropriate HTTP status
        if (error.code === grpc.status.NOT_FOUND || error.message.includes("Track audio not found")) {
            return res.status(404).send(error.message);
        }
        res.status(500).send("Internal server error during streaming.");
    }
};

module.exports = { streamTrack }