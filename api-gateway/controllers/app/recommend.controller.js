const { getRecommendationServiceClient } = require("../../utils/loadProtoClients");

const handleGrpcCall = async (res, serviceCallPromise) => {
    try {
        const result = await serviceCallPromise;
        return res.status(200).send(result);
    } catch (error) {
        console.error("error:", error.message);
        return res.status(500).send(error.message);
    }
}

const recommendations = async (req, res) => {
    const { id, limit, offset } = req.query;

    let endPoint = req._parsedUrl.pathname.split("/")
    endPoint = endPoint.find(e => e);

    const recommendService = getRecommendationServiceClient();
    let serviceMethod = {};
    switch (endPoint) {
        case "personalised":
            serviceMethod = recommendService.GetTrackRecommendation;
            break;
        case "general":
        default:
            serviceMethod = recommendService.GetGeneralRecommendation;
            break;
    }
    await handleGrpcCall(res, new Promise((resolve, reject) => {
        serviceMethod.bind(recommendService)({ user_id: id, limit, offset }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    }))
}

module.exports = { recommendations }