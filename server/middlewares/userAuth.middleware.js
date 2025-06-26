import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        console.log("Not Authorized. Please login again.");
        return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        req.user = user; // ✅ Best Practice

        next();

    } catch (error) {
        console.log("Error in userAuth middleware:", error.message);
        return res.status(500).json({ success: false, message: "Authentication Error" });
    }
};

export default userAuth;
