const { getTrackRecommendation, getGeneralRecommendation } = require("../controllers/recommend.controller");

const recommendGrpcObject = {
    GetTrackRecommendation: async (call, callBack) => {
        const res = await getTrackRecommendation(call.request);
        callBack(null, res);
    },
    GetGeneralRecommendation: async (call, callBack) => {
        const res = await getGeneralRecommendation(call.request);
        callBack(null, res);
    },
}

module.exports = { recommendGrpcObject }