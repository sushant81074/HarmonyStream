const { isValidObjectId } = require("mongoose");
const { fieldValidator } = require("../../../shared/fieldValidator");
const { getContentServiceClient } = require("../clients/contentGrpcClient");

const searchArtists = async ({ query_string, limit, offset }) => {
    try {
        const isValid = fieldValidator({ query_string }, ["query_string"]);
        if (!isValid) throw new Error("query_string is required");

        const contentService = await getContentServiceClient();
        if (contentService instanceof Error) throw new Error("unable to connect with content-service");
        let foundArtists;
        if (isValidObjectId(query_string)) {
            const artistById = await new Promise((resolve, reject) => {
                contentService.GetArtist({ artist_id: query_string }, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                })
            })
            foundArtists = artistById?.artist;
        } else {
            let artistsByName = await new Promise((resolve, reject) => {
                contentService.ListArtists({}, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                })
            })
            artistsByName = artistsByName?.artists;

            if (Array.isArray(artistsByName) && artistsByName.length) {
                foundArtists = artistsByName.filter(artist => artist.name.toLowerCase() == query_string.toLowerCase());
            }
        }

        if (!limit) limit = 10;
        if (!offset) offset = 0;

        if (Array.isArray(foundArtists) && foundArtists.length) {
            foundArtists = foundArtists.slice(offset, offset + limit);
        } else foundArtists = [foundArtists];

        return {
            success: true,
            message: "done",
            artists: foundArtists
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return { success: false, message: error.message || "internal server error" }
    }
}
const searchAlbums = async ({ query_string, limit = 10, offset = 0, release_year }) => {
    try {
        const isValid = fieldValidator({ query_string }, ["query_string"]);
        if (!isValid) throw new Error("query_string is required");
        if (!isValidObjectId(query_string)) throw new Error("invalid request id")

        const contentService = await getContentServiceClient();
        if (contentService instanceof Error) throw new Error("unable to connect with content-service");

        let albumsByArtist = await new Promise((resolve, reject) => {
            contentService.ListAlbumsByArtist({ artist_id: query_string }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        albumsByArtist = albumsByArtist?.albums;

        if (!limit) limit = 10;
        if (!offset) offset = 0;

        if (Array.isArray(albumsByArtist) && albumsByArtist.length) {
            if (release_year) albumsByArtist = albumsByArtist.filter(album => album.releaseYear = release_year);
            albumsByArtist = albumsByArtist.slice(offset, offset + limit);
        }

        return {
            success: true,
            message: "done",
            albums: albumsByArtist
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return { success: false, message: error.message || "internal server error" }
    }
}
const searchTracks = async ({ query_string, limit = 10, offset = 0, genre }) => {
    try {
        const isValid = fieldValidator({ query_string }, ["query_string"]);
        if (!isValid) throw new Error("query_string is required");
        if (!isValidObjectId(query_string)) throw new Error("invalid request id")

        const contentService = await getContentServiceClient();
        if (!contentService) throw new Error("unable to connect with content service");

        let tracksByAlbum = await new Promise((resolve, reject) => {
            contentService.ListTracksByAlbum({ album_id: query_string }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
        tracksByAlbum = tracksByAlbum.tracks;

        if (!limit) limit = 10;
        if (!offset) offset = 0;


        if (Array.isArray(tracksByAlbum) && tracksByAlbum.length) {
            if (genre) tracksByAlbum = tracksByAlbum.filter(track => track.genre.toLowerCase() == genre.toLowerCase());
            tracksByAlbum = tracksByAlbum.slice(offset, offset + limit);
        }

        return {
            success: true,
            message: "done",
            tracks: tracksByAlbum
        }
    } catch (error) {
        console.error("error occured:", error.message);
        return { success: false, message: error.message || "internal server error" }
    }
}
const searchContent = async ({ query_string, limit, offset, release_year, genre }) => {
    try {

        const isValid = fieldValidator({ query_string }, ["query_string"]);
        if (!isValid) throw new Error("artist is required");

        const [artistRes, albumRes, trackRes] = await Promise.all([
            searchArtists({ query_string, limit, offset }),
            searchAlbums({ query_string, limit, offset, release_year, }),
            searchTracks({ query_string, limit, offset, genre })
        ]);

        return {
            success: true,
            message: "done",
            artists: artistRes.success ? artistRes.artists : [],
            albums: albumRes.success ? albumRes.albums : [],
            tracks: trackRes.success ? trackRes.tracks : []
        }

    } catch (error) {
        console.error("error occured:", error.message);
        return { success: false, message: error.message || "internal server error" }
    }
}

module.exports = { searchContent, searchAlbums, searchArtists, searchTracks }