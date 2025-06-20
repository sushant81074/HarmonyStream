const { getSearchServiceClient } = require("../../utils/loadProtoClients");

const handleGrpcCall = async (res, serviceCallPromise) => {
    try {
        const result = await serviceCallPromise;
        return res.status(200).send(result);
    } catch (error) {
        console.error("error:", error.message);
        return res.status(500).send(error.message);
    }
}

const search = async (req, res) => {
    const { query, limit, offset, genre, release } = req.query;
    const searchService = getSearchServiceClient();

    let endPoint = req._parsedUrl.pathname.split("/")
    endPoint = endPoint.find(point => point)
    console.log({ endPoint });

    let serviceMethod = {}
    switch (endPoint) {
        case "artists":
            serviceMethod = searchService.SearchArtists;
            break;
        case "albums":
            serviceMethod = searchService.SearchAlbums;
            break;
        case "tracks":
            serviceMethod = searchService.SearchTracks;
            break;
        case "all":
        default:
            serviceMethod = searchService.SearchContent;
            break;
    }
    if (!serviceMethod || typeof serviceMethod !== "function") throw new Error("service method not found");

    await handleGrpcCall(res, new Promise((resolve, reject) => {
        serviceMethod.bind(searchService)({ query_string: query, limit, offset, genre, release_year: release }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}

// const searchAlbum = async (req, res) => {
//     const { query_string, limit, offset, genre, release_year } = req.body;
//     const searchService = getSearchServiceClient();
//     await handleGrpcCall(res, new Promise((resolve, reject) => {
//         searchService.SearchAlbums({ query_string, limit, offset, genre, release_year }, (err, res) => {
//             if (err) reject(err);
//             else resolve(res);
//         })
//     }))
// }

// const searchTrack = async (req, res) => {
//     const { query_string, limit, offset, genre, release_year } = req.body;
//     const searchService = getSearchServiceClient();
//     await handleGrpcCall(res, new Promise((resolve, reject) => {
//         searchService.SearchTracks({ query_string, limit, offset, genre, release_year }, (err, res) => {
//             if (err) reject(err);
//             else resolve(res);
//         })
//     }))
// }

// const searchContent = async (req, res) => {
//     const { query_string, limit, offset, genre, release_year } = req.body;
//     const searchService = getSearchServiceClient();
//     await handleGrpcCall(res, new Promise((resolve, reject) => {
//         searchService.SearchContent({ query_string, limit, offset, genre, release_year }, (err, res) => {
//             if (err) reject(err);
//             else resolve(res);
//         })
//     }))
// }

module.exports = { search }