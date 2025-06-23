const { getContentServiceClient } = require("../../utils/loadProtoClients");

const handleGrpcCall = async (res, serviceCallPromise) => {
    try {
        const result = await serviceCallPromise;
        return res.status(200).send(result);
    } catch (error) {
        console.error("error:", error.message);
        return res.status(500).send(error.message);
    }
}

const createArtist = async (req, res) => {
    const { name, bio, image } = req.body;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.CreateArtist({ name, bio, image }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const getArtist = async (req, res) => {
    const { id } = req.query;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.GetArtist({ artist_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const updateArtist = async (req, res) => {
    const { id } = req.params;
    const { name, bio, image } = req.body;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.UpdateArtist({ artist_id: id, name, bio, image }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const deleteArtist = async (req, res) => {
    const { id } = req.params;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.DeleteArtist({ artist_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const listArtists = async (req, res) => {
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.ListArtists({}, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const createAlbum = async (req, res) => {
    const { title, artId, release, cover } = req.body;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.CreateAlbum({ title, artist_id: artId, release, cover_image: cover }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const getAlbum = async (req, res) => {
    const { id } = req.query;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.GetAlbum({ album_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const updateAlbum = async (req, res) => {
    const { id } = req.params;
    const { title, artId, release, cover } = req.body;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.UpdateAlbum({ album_id: id, title, artist_id: artId, release, cover_image: cover }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const deleteAlbum = async (req, res) => {
    const { id } = req.params;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.DeleteAlbum({ album_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const listAlbumsByArtist = async (req, res) => {
    const { id } = req.query;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.ListAlbumsByArtist({ artist_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const createTrack = async (req, res) => {
    const { title, artId, albId, duration, genre, audioUrl } = req.body;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.CreateTrack({ title, artist_id: artId, album_id: albId, duration_sec: duration, genre, audio_url: audioUrl }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const getTrack = async (req, res) => {
    const { id } = req.query;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.GetTrack({ track_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const updateTrack = async (req, res) => {
    const { id } = req.params;
    const { title, artId, albId, duration, genre, audioUrl } = req.body;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.UpdateTrack({ track_id: id, title, artist_id: artId, album_id: albId, duration_sec: duration, genre, audio_url: audioUrl }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const deleteTrack = async (req, res) => {
    const { id } = req.params;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.DeleteTrack({ track_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const listTracksByAlbum = async (req, res) => {
    const { id } = req.query;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.ListTracksByAlbum({ album_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const listMostPlayedTracks = async (req, res) => {
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.ListMostPlayedTracks({}, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}
const incrementTrackPlayCount = async (req, res) => {
    const { id } = req.params;
    const contentService = getContentServiceClient();
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        contentService.IncrementTrackPlayCount({ track_id: id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}

module.exports = {
    createArtist,
    getArtist,
    updateArtist,
    deleteArtist,
    listArtists,
    createAlbum,
    getAlbum,
    updateAlbum,
    deleteAlbum,
    listAlbumsByArtist,
    createTrack,
    getTrack,
    updateTrack,
    deleteTrack,
    listTracksByAlbum,
    listMostPlayedTracks,
    incrementTrackPlayCount
}