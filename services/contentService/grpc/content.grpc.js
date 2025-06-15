const { createAlbum, getAlbum, updateAlbum, deleteAlbum, listAlbumsByArtist } = require('../controllers/album.controller');
const { createArtist, getArtist, updateArtist, deleteArtist, listArtists } = require('../controllers/artist.controller');
const { createTrack, getTrack, updateTrack, deleteTrack, listTracksByAlbum, incrementTrackPlayCount } = require('../controllers/track.controller');

const contentGrpcObject = {
    CreateArtist: async (call, callBack) => {
        const { name, bio, image } = call.request;
        const res = await createArtist({ name, bio, image });
        callBack(null, res);
    },
    GetArtist: async (call, callBack) => {
        const { artist_id } = call.request;
        const res = await getArtist({ artist_id });
        callBack(null, res);
    },
    UpdateArtist: async (call, callBack) => {
        const { artist_id, name, bio, image } = call.request;
        const res = await updateArtist({ artist_id, name, bio, image });
        callBack(null, res);
    },
    DeleteArtist: async (call, callBack) => {
        const { artist_id } = call.request;
        const res = await deleteArtist({ artist_id });
        callBack(null, res);
    },
    ListArtists: async (_, callBack) => {
        const res = await listArtists();
        callBack(null, res);
    },
    CreateAlbum: async (call, callBack) => {
        const { title, artist_id, release, cover_image } = call.request;
        const res = await createAlbum({ title, artist_id, release, cover_image });
        callBack(null, res);
    },
    GetAlbum: async (call, callBack) => {
        const { album_id } = call.request;
        const res = await getAlbum({ album_id });
        callBack(null, res);
    },
    UpdateAlbum: async (call, callBack) => {
        const { album_id, title, artist_id, release, cover_image } = call.request;
        const res = await updateAlbum({ album_id, title, artist_id, release, cover_image });
        callBack(null, res);
    },
    DeleteAlbum: async (call, callBack) => {
        const { album_id } = call.request;
        const res = await deleteAlbum({ album_id });
        callBack(null, res);
    },
    ListAlbumsByArtist: async (call, callBack) => {
        const { artist_id } = call.request;
        const res = await listAlbumsByArtist({ artist_id });
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
        const res = await deleteTrack(call.request);
        callBack(null, res);
    },
    ListTracksByAlbum: async (call, callBack) => {
        const res = await listTracksByAlbum(call.request);
        callBack(null, res);
    },
    IncrementTrackPlayCount: async (call, callBack) => {
        const res = await incrementTrackPlayCount(call.request);
        callBack(null, res);
    }
}

module.exports = { contentGrpcObject }