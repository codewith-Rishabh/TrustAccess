import User from '../models/user.model.js';

export const getUserData = async (req, res) => {
    try {
        // ✅ Getting user directly from middleware (we set it in req.user)
        const user = req.user;

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
                email: user.email,
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
