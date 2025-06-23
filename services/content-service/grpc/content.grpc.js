const { createAlbum, getAlbum, updateAlbum, deleteAlbum, listAlbumsByArtist } = require('../controllers/album.controller');
const { createArtist, getArtist, updateArtist, deleteArtist, listArtists } = require('../controllers/artist.controller');
const { createTrack, getTrack, updateTrack, deleteTrack, listTracksByAlbum, incrementTrackPlayCount, listMostPlayedTracks } = require('../controllers/track.controller');

const contentGrpcObject = {
    CreateArtist: async (call, callBack) => {
        const res = await createArtist(call.request);
        callBack(null, res);
    },
    GetArtist: async (call, callBack) => {
        console.log(call.request);
        const res = await getArtist(call.request);
        callBack(null, res);
    },
    UpdateArtist: async (call, callBack) => {
        const res = await updateArtist(call.request);
        callBack(null, res);
    },
    DeleteArtist: async (call, callBack) => {
        const res = await deleteArtist(call.request);
        callBack(null, res);
    },
    ListArtists: async (_, callBack) => {
        const res = await listArtists();
        callBack(null, res);
    },
    CreateAlbum: async (call, callBack) => {
        const res = await createAlbum(call.request);
        callBack(null, res);
    },
    GetAlbum: async (call, callBack) => {
        const res = await getAlbum(call.request);
        callBack(null, res);
    },
    UpdateAlbum: async (call, callBack) => {
        const res = await updateAlbum(call.request);
        callBack(null, res);
    },
    DeleteAlbum: async (call, callBack) => {
        const res = await deleteAlbum(call.request);
        callBack(null, res);
    },
    ListAlbumsByArtist: async (call, callBack) => {
        const res = await listAlbumsByArtist(call.request);
        callBack(null, res);
    },
    CreateTrack: async (call, callBack) => {
        const res = await createTrack(call.request);
        callBack(null, res);
    },
    GetTrack: async (call, callBack) => {
        const res = await getTrack(call.request);
        callBack(null, res);
    },
    UpdateTrack: async (call, callBack) => {
        const res = await updateTrack(call.request);
        callBack(null, res);
    },
    DeleteTrack: async (call, callBack) => {
        const { id: track_id } = (call.request);
        const res = await deleteTrack({ track_id });
        callBack(null, res);
    },
    ListTracksByAlbum: async (call, callBack) => {
        const res = await listTracksByAlbum(call.request);
        callBack(null, res);
    },
    IncrementTrackPlayCount: async (call, callBack) => {
        const res = await incrementTrackPlayCount(call.request);
        callBack(null, res);
    },
    ListMostPlayedTracks: async (call, callBack) => {
        const res = await listMostPlayedTracks(call.request);
        callBack(null, res);
    },
}

module.exports = { contentGrpcObject }