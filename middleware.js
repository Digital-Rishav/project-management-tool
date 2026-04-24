const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(403).json({
                message: "Token missing"
            });
        }

        const decoded = jwt.verify(token, "Rishav1471password");
        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports = {
    authMiddleware
};