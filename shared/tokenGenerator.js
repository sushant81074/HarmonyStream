const { setCache } = require("./redis");
const { randomUUID } = require("crypto")
const createAccessAndRefreshToken = async ({ urId }) => {
    try {
        const token = randomUUID();
        const refreshToken = randomUUID();
        await setCache(token, urId, 3600 * 12);
        await setCache(refreshToken, urId, 3600 * 25 * 15)
        return { token, refreshToken }
    } catch (error) {
        console.error("error occured:", error.message);
    }
}

module.exports = {
    createAccessAndRefreshToken
}