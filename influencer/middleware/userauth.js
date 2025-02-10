const jwt = require("jsonwebtoken");
const celebModel = require("../models/celeb.model");

module.exports.userauth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details
        const celeb = await celebModel.findById(decoded.id);

        if (!celeb) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        req.celeb = celeb; // Attach user to request
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ message: "Invalid or expired token" });
    }
};
