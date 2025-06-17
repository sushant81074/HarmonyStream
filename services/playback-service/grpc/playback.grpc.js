const { playTrack, pauseTrack, resumeTrack, stopPlayback, getPlaybackState, addTrackToQueue, removeTrackFromQueue, getQueue, clearQueue, getPlaybackHistory } = require("../controller/playback.controller");

const playbackGrpcObject = {
    PlayTrack: async (call, callBack) => {
        const res = await playTrack(call.request);
        callBack(null, res);
    },
    PauseTrack: async (call, callBack) => {
        const res = await pauseTrack(call.request);
        callBack(null, res);
    },
    ResumeTrack: async (call, callBack) => {
        const res = await resumeTrack(call.request);
        callBack(null, res);
    },
    StopPlayback: async (call, callBack) => {
        const res = await stopPlayback(call.request);
        callBack(null, res);
    },
    GetPlaybackState: async (call, callBack) => {
        const res = await getPlaybackState(call.request);
        callBack(null, res);
    },
    GetPlayHistory: async (call, callBack) => {
        const res = await getPlaybackHistory(call.request);
        callBack(null, res);
    },
    AddTrackToQueue: async (call, callBack) => {
        const res = await addTrackToQueue(call.request);
        callBack(null, res);
    },
    RemoveTrackFromQueue: async (call, callBack) => {
        const res = await removeTrackFromQueue(call.request);
        callBack(null, res);
    },
    GetQueue: async (call, callBack) => {
        const res = await getQueue(call.request);
        callBack(null, res);
    },
    ClearQueue: async (call, callBack) => {
        const res = await clearQueue(call.request);
        callBack(null, res);
    },
};

module.exports = { playbackGrpcObject }