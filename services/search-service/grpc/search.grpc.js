const { searchContent, searchArtists, searchAlbums, searchTracks } = require("../controllers/search.controller");

const searchGrpcObject = {
    SearchContent: async (call, callBack) => {
        const res = await searchContent(call.request);
        callBack(null, res);
    },
    SearchArtists: async (call, callBack) => {
        const res = await searchArtists(call.request);
        callBack(null, res);
    },
    SearchAlbums: async (call, callBack) => {
        const res = await searchAlbums(call.request);
        callBack(null, res);
    },
    SearchTracks: async (call, callBack) => {
        const res = await searchTracks(call.request);
        callBack(null, res);
    },
}

module.exports = { searchGrpcObject }