const { isValidObjectId } = require("mongoose");
const { fieldValidator } = require("../../../shared/fieldValidator");
const { getContentServiceClient } = require("../clients/contentGrpcClient");
const { getPlaybackServiceClient } = require("../clients/playbackGrpcClient");

const filterTracksForRecommendation = (tracks) => {
    const genres = {}
    const artists = {}
    tracks.forEach(track => {
        if (Array.isArray(genres[`${track.genre}`])) genres[`${track.genre}`].push(track);
        else genres[`${track.genre}`] = [track];

        if (Array.isArray(artists[`${track.artist_id}`])) artists[`${track.artist_id}`].push(track);
        else artists[`${track.artist_id}`] = [track];
    })
    return { genres, artists };
}

const getTrackRecommendation = async ({ user_id, limit, offset }) => {
    try {

        const isValid = fieldValidator({ user_id }, ["user_id"]);
        if (!isValid || !isValidObjectId(user_id)) throw new Error("invalid request id");

        if (!limit) limit = 10;
        if (!offset) offset = 0;

        const playbackService = getPlaybackServiceClient();
        if (playbackService instanceof Error) throw new Error("unable to connect with playback-service");

        let userPlaybacks = await new Promise((resolve, reject) => {
            playbackService.GetPlayHistory({ user_id, limit, offset }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        userPlaybacks = userPlaybacks.history;
        if (!Array.isArray(userPlaybacks) || !userPlaybacks.length) console.error("no user playbacks found");

        const contentService = getContentServiceClient();
        if (contentService instanceof Error) throw new Error("unable to connect with content-service");

        const recentlyPlayedTracks = []
        for (const playback of userPlaybacks) {
            let tracks = await new Promise((resolve, reject) => {
                contentService.ListTracksByAlbum(
                    { album_id: playback.album_id, limit: 100, offset: 0 },
                    (err, res) => {
                        if (err) reject(err);
                        else resolve(res);
                    }
                );
            });
            tracks = tracks.tracks;
            if (Array.isArray(tracks) && tracks.length) recentlyPlayedTracks.push(...tracks);
        }

        const { genres, artists } = filterTracksForRecommendation(recentlyPlayedTracks);

        console.log({ success: true, message: "done", genres: JSON.stringify(genres), artists: JSON.stringify(artists) });
        return { success: true, message: "done", genres: JSON.stringify(genres), artists: JSON.stringify(artists) }
    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error"
        }
    }
}
const getGeneralRecommendation = async ({ limit, offset }) => {
    try {
        if (!limit) limit = 10;
        if (!offset) offset = 0;

        const contentService = getContentServiceClient();
        if (contentService instanceof Error) throw new Error("unable to connect with content-service");

        let recentlyPlayedTracksGlobally = await new Promise((resolve, reject) => {
            contentService.ListMostPlayedTracks({}, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        recentlyPlayedTracksGlobally = recentlyPlayedTracksGlobally.tracks;
        const { genres, artists } = filterTracksForRecommendation(recentlyPlayedTracksGlobally);

        return { success: true, message: "done", genres: JSON.stringify(genres), artists: JSON.stringify(artists) }

    } catch (error) {
        console.error("error occured:", error.message);
        return {
            success: false,
            message: error.message || "internal server error"
        }
    }
}

module.exports = { getTrackRecommendation, getGeneralRecommendation }