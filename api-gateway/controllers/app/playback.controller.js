const { getPlaybackServiceClient } = require("../../utils/loadProtoClients");

const handleGrpcCall = async (res, serviceCallPromise) => {
    try {
        const result = await serviceCallPromise;
        return res.status(200).send(result);
    } catch (error) {
        console.error("error:", error.message);
        return res.status(500).send(error.message);
    }
}

const playTrack = async (req, res) => {
    const { uId, tId } = req.body;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.PlayTrack({ user_id: uId, track_id: tId }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const pauseTrack = async (req, res) => {
    const { id } = req.params;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.PauseTrack({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const resumeTrack = async (req, res) => {
    const { id } = req.params;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.ResumeTrack({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const stopPlayback = async (req, res) => {
    const { id } = req.params;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.StopPlayback({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const getPlaybackState = async (req, res) => {
    const { id } = req.query;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.GetPlaybackState({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const getPlayHistory = async (req, res) => {
    const { id, limit, offset } = req.query;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.GetPlayHistory({ user_id: id, limit, offset }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const addTrackToQueue = async (req, res) => {
    const { uId, tId } = req.body;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.AddTrackToQueue({ user_id: uId, track_id: tId }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const removeTrackFromQueue = async (req, res) => {
    const { uId, tId } = req.body;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.RemoveTrackFromQueue({ user_id: uId, track_id: tId }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const getQueue = async (req, res) => {
    const { id } = req.query;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.GetQueue({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const clearQueue = async (req, res) => {
    const { id } = req.params;
    const playbackService = getPlaybackServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        playbackService.ClearQueue({ user_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}

module.exports = {
    playTrack,
    pauseTrack,
    resumeTrack,
    stopPlayback,
    getPlaybackState,
    getPlayHistory,
    addTrackToQueue,
    removeTrackFromQueue,
    getQueue,
    clearQueue
}