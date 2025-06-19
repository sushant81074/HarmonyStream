const { isValidObjectId } = require("mongoose");
const { fieldValidator } = require("../../../shared/fieldValidator");
const { getUserServiceClient } = require("../clients/userGrpcClient");
const { getContentServiceClient } = require("../clients/contentGrpcClient");
const Playbacks = require("../schemas/playback.schema");
const { setCache, redisPub, getCache } = require("../../../shared/redis");

const playTrack = async ({ user_id, track_id }) => {
    try {
        const isValid = fieldValidator({ user_id, track_id }, ["user_id", "track_id"])
        if (!isValid) throw new Error("invalid request payload");

        if (!isValidObjectId(user_id) || !isValidObjectId(track_id)) throw new Error("invalid request ids");

        const userService = getUserServiceClient();
        if (userService instanceof Error) throw new Error("unable to connect with user-service")
        const userExists = await new Promise((resolve, reject) => {
            userService.GetUserById({ user_id }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        });
        if (!userExists) throw new Error("user with id not found");


        const contentService = getContentServiceClient();
        if (contentService instanceof Error) throw new Error("unable to connect with content-service")
        const trackExists = await new Promise((resolve, reject) => {
            contentService.GetTrack({ track_id }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        if (!trackExists) throw new Error("track with id not found");

        const newPlayback = await Playbacks.create({ user: user_id, track: track_id, album: trackExists.track.album_id });
        if (!newPlayback) throw new Error("unable to create playback and play track");

        const incTrackPlayCount = await new Promise((resolve, reject) => {
            contentService.IncrementTrackPlayCount({ track_id }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        if (!incTrackPlayCount.success) console.error("unable to increase playcount for track:", track_id);

        const queKey = `playbackQue:${user_id}`;
        let userPlaybackQue = await getCache(queKey);

        if (userPlaybackQue && Array.isArray(userPlaybackQue)) {
            if (userPlaybackQue.includes(track_id)) {
                userPlaybackQue = userPlaybackQue.filter(id => id !== track_id);
            }
            userPlaybackQue.unshift(track_id);
        } else userPlaybackQue = [track_id];

        await setCache(queKey, userPlaybackQue);

        const playbackStateKey = `playbackState:${user_id}`;
        const playbackState = {
            user_id,
            current_track_id: track_id,
            current_position_sec: 0,
            current_track_duration_sec: trackExists.duration_sec,
            is_playing: true,
            updated_at: Date.now(),
            queue_track_ids: userPlaybackQue,
        };
        const curPlaybackState = await setCache(playbackStateKey, playbackState);
        console.log(curPlaybackState);
        if (!curPlaybackState) throw new Error("unable to set playback and play track to cache");

        const playbackUpdateChannel = `playbackUpdate:${user_id}`;
        await redisPub(playbackUpdateChannel, playbackState);

        return { success: true, message: "done", state: playbackState }
    } catch (error) {
        console.error("error occured:", error.message)
        return { success: false, message: error.message || "internal server error", }
    }
}
const pauseTrack = async ({ user_id }) => {
    try {
        const isValid = fieldValidator({ user_id }, ["user_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        const playbackStateKey = `playbackState:${user_id}`;
        const playbackState = await getCache(playbackStateKey);
        if (!playbackState) throw new Error("playback state for user not found");

        const now = Date.now();
        const elapsedSec = Math.floor((now - playbackState.updated_at) / 1000);

        // Add elapsed time to current position, cap at track duration
        playbackState.current_position_sec = Math.min(
            playbackState.current_position_sec + elapsedSec,
            playbackState.current_track_duration_sec
        );
        playbackState.is_playing = false;
        playbackState.updated_at = now;

        await setCache(playbackStateKey, playbackState);

        const playbackUpdateChannel = `playbackUpdate:${user_id}`;
        await redisPub(playbackUpdateChannel, playbackState);

        return { success: true, message: "done", state: playbackState }
    } catch (error) {
        console.error("error occured:", error.message)
        return { success: false, message: error.message || "internal server error", }
    }
}
const resumeTrack = async ({ user_id }) => {
    try {

        const isValid = fieldValidator({ user_id }, ["user_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        const playbackStateKey = `playbackState:${user_id}`;
        const playbackState = await getCache(playbackStateKey);
        if (!playbackState) throw new Error("playback state for user not found");

        playbackState.is_playing = true;
        playbackState.updated_at = Date.now();

        await setCache(playbackStateKey, playbackState);

        const playbackUpdateChannel = `playbackUpdate:${user_id}`;
        await redisPub(playbackUpdateChannel, playbackState);

        return { success: true, message: "done", state: playbackState }
    } catch (error) {
        console.error("error occured:", error.message)
        return { success: false, message: error.message || "internal server error", }
    }
}
const stopPlayback = async ({ user_id }) => {
    try {

        const isValid = fieldValidator({ user_id }, ["user_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        const playbackStateKey = `playbackState:${user_id}`;
        let playbackState = await getCache(playbackStateKey);
        if (!playbackState) throw new Error("playback state for user not found");

        playbackState = {
            user_id,
            current_track_id: "",
            current_position_sec: 0,
            current_track_duration_sec: 0,
            is_playing: false,
            updated_at: Date.now(),
            queue_track_ids: [],
        }
        await setCache(playbackStateKey, playbackState);

        const queKey = `playbackQue:${user_id}`;
        await setCache(queKey, []);

        const playbackUpdateChannel = `playbackUpdate:${user_id}`;
        await redisPub(playbackUpdateChannel, playbackState);

        return { success: true, message: "done", state: playbackState }

    } catch (error) {
        console.error("error occured:", error.message)
        return {
            success: false,
            message: error.message || "internal server error",
        }
    }
}
const getPlaybackState = async ({ user_id }) => {
    try {

        const isValid = fieldValidator({ user_id }, ["user_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        const playbackStateKey = `playbackState:${user_id}`;
        let playbackState = await getCache(playbackStateKey);
        if (!playbackState) throw new Error("playback state for user not found");

        const now = Date.now();
        const elapsedSec = Math.floor((now - playbackState.startedAt) / 1000);

        playbackState.current_position_sec = Math.min(
            playbackState.current_position_sec + elapsedSec,
            playbackState.current_track_duration_sec
        );
        playbackState.updated_at = now;

        await setCache(playbackStateKey, playbackState);

        return {
            success: true,
            message: "done",
            state: playbackState
        }
    } catch (error) {
        console.error("error occured:", error.message)
        return { success: false, message: error.message || "internal server error", }
    }
}
const getPlaybackHistory = async ({ user_id, limit = 10, offset = 0 }) => {
    try {

        const isValid = fieldValidator({ user_id }, ["user_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        const history = await Playbacks.find({ user: user_id }).sort({ playedAt: -1 }).skip(offset).limit(limit);
        const res = {
            success: true,
            message: "done",
            history: history.map(playback => {
                return {
                    playback_id: playback._id,
                    user_id: playback.user,
                    track_id: playback.track,
                    album_id: playback.album,
                    played_at: playback.playedAt
                }
            })
        }
        return res;
    } catch (error) {
        console.error("error occured:", error.message)
        return {
            success: false,
            message: error.message || "internal server error",
        }
    }
}
const addTrackToQueue = async ({ user_id, track_id }) => {
    try {
        const isValid = fieldValidator({ user_id, track_id }, ["user_id", "track_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id) || !isValidObjectId(track_id)) throw new Error("invalid request ids");

        const contentService = getContentServiceClient();
        const trackExists = await new Promise((resolve, reject) => {
            contentService.GetTrack({ track_id }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        });
        if (!trackExists) throw new Error("track not found");

        const queKey = `playbackQue:${user_id}`;
        let playbackQue = await getCache(queKey);

        if (!playbackQue || !Array.isArray(playbackQue) || !playbackQue.length) {
            playbackQue = [track_id];
        } else if (!playbackQue.includes(track_id)) playbackQue.push(track_id);

        const playbackStateKey = `playbackState:${user_id}`;
        let playbackState = await getCache(playbackStateKey);
        if (!playbackState) {
            playbackState = {
                user_id,
                current_track_id: track_id,
                current_position_sec: 0,
                current_track_duration_sec: trackExists.duration_sec,
                is_playing: true,
                updated_at: Date.now(),
                queue_track_ids: playbackQue,
            };
        } else {
            playbackState.current_track_id = track_id;
            playbackState.queue_track_ids = playbackQue;
            playbackState.updated_at = Date.now();
        }
        await setCache(queKey, playbackQue);
        await setCache(playbackStateKey, playbackState);

        const playbackUpdateChannel = `playbackUpdate:${user_id}`;
        await redisPub(playbackUpdateChannel, playbackState);

        return {
            success: true,
            message: "done",
            state: playbackState
        }
    } catch (error) {
        console.error("error occured:", error)
        return {
            success: false,
            message: error.message || "internal server error",
        }
    }
}
const removeTrackFromQueue = async ({ user_id, track_id }) => {
    try {
        const isValid = fieldValidator({ user_id, track_id }, ["user_id", "track_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id) || !isValidObjectId(track_id)) throw new Error("invalid request ids");

        let trackIdx = "";
        const queKey = `playbackQue:${user_id}`;
        let playbackQue = await getCache(queKey);
        if (!Array.isArray(playbackQue) || !playbackQue.length || !playbackQue.includes(track_id)) throw new Error("queue doesn't contain track");
        else {
            trackIdx = playbackQue.indexOf(track_id);
            playbackQue = playbackQue.filter(id => id !== track_id);
        }

        const playbackStateKey = `playbackState:${user_id}`;
        let playbackState = await getCache(playbackStateKey);
        if (!playbackState) throw new Error("playback state for user not found");

        playbackState.queue_track_ids = playbackQue;
        playbackQue.current_track_id = "";
        playbackState.updated_at = Date.now();

        await setCache(queKey, playbackQue);
        await setCache(playbackStateKey, playbackState);

        const playbackUpdateChannel = `playbackUpdate:${user_id}`;
        await redisPub(playbackUpdateChannel, playbackState);

        return { success: true, message: "done", state: playbackState }
    } catch (error) {
        console.error("error occured:", error.message)
        return { success: false, message: error.message || "internal server error", }
    }
}
const getQueue = async ({ user_id }) => {
    try {

        const isValid = fieldValidator({ user_id }, ["user_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        const playbackStateKey = `playbackState:${user_id}`;
        let playbackState = await getCache(playbackStateKey);
        if (!playbackState) throw new Error("playback state for user not found");

        return { success: true, message: "done", queue_track_ids: playbackState.queue_track_ids }
    } catch (error) {
        console.error("error occured:", error.message)
        return { success: false, message: error.message || "internal server error" }
    }
}
const clearQueue = async ({ user_id }) => {
    try {

        const isValid = fieldValidator({ user_id }, ["user_id"])
        if (!isValid) throw new Error("invalid request payload");
        if (!isValidObjectId(user_id)) throw new Error("invalid request id");

        const queKey = `playbackQue:${user_id}`;
        await setCache(queKey, []);

        const playbackStateKey = `playbackState:${user_id}`;
        let playbackState = await getCache(playbackStateKey);
        if (!playbackState) throw new Error("playback state for user not found");

        playbackState.queue_track_ids = [];
        playbackState.updated_at = Date.now();
        await setCache(playbackStateKey, playbackState);

        const playbackUpdateChannel = `playbackUpdate:${user_id}`;
        await redisPub(playbackUpdateChannel, playbackState);

        return { success: true, message: "done", state: playbackState }
    } catch (error) {
        console.error("error occured:", error.message)
        return { success: false, message: error.message || "internal server error" }
    }
}

module.exports = {
    playTrack,
    pauseTrack,
    resumeTrack,
    stopPlayback,
    getPlaybackState,
    getPlaybackHistory,
    addTrackToQueue,
    removeTrackFromQueue,
    getQueue,
    clearQueue
}