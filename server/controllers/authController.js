import bcrypt from 'bcrypt';
import transporter from '../canfig/nodemailer.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// SignUp Controller 
export const SignUp = async (req, res) => {
    const { name, email, password } = req.body;
     console.log("User attempting to sign up:", req.body.email);

    if (!name || !email || !password) {
        console.log("All fields are required");
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        try {
            const mailOptions = {
                from: process.env.SMPT_SENDER,
                to: email,
                subject: `Welcome to Rishabh Auth Server, ${name}!`,
                text: `Welcome to our platform, ${name}! Your account has been successfully created with the email ${email}.`
            }
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
        }

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });
    } catch (error) {
        console.error("Error in SignUp Controller:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Login Controller
export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("User attempting to sign up:", req.body.email);

    if (!email || !password) {
        console.log("All fields are required");
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please SignUp." });
        }

        const isvalidPassword = await bcrypt.compare(password, user.password);
        if (!isvalidPassword) {
            console.log("Invalid Credentials");
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Error in Login Controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Logout Controller
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Error in Logout Controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Check if user authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "User is authenticated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Send verification OTP to user email
export const sendVerifyOtp = async (req, res) => {
    try {
        // ✅ Get user directly from middleware
        const user = req.user;

        if (user.isAccountVerified) {
            console.log("Account already verified");
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        // Generate OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = OTP;
        user.verifyOtpExpiresAt = Date.now() + 60 * 60 * 1000; // OTP valid for 1 hour
        await user.save();

        // Send OTP email
        try {
            const mailOptions = {
                from: process.env.SMPT_SENDER,
                to: user.email,
                subject: "Verify Your Account",
                text: `Your OTP for account verification is ${OTP}. It is valid for 1 hour.`
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending OTP email:", error);
            return res.status(500).json({ success: false, message: "Failed to send OTP email" });
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email",
            otp: OTP // For testing, you can remove in production
        });

    } catch (error) {
        console.error("Error in sendVerifyOtp Controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Verify user account with email 
export const verifyEmail = async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        console.log("OTP is required");
        return res.status(400).json({ success: false, message: "OTP is required" });
    }

    try {
        // ✅ Get user directly from the middleware
        const user = req.user;

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            console.log("Invalid OTP");
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpiresAt < Date.now()) {
            console.log("OTP has expired");
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiresAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: "Email Verified Successfully" });

    } catch (error) {
        console.error("Error in verifyEmail Controller:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


// Send OTP to Reset Password
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = OTP;
        user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        try {
            const mailOptions = {
                from: process.env.SMPT_SENDER,
                to: user.email,
                subject: `Password Reset OTP`,
                text: `Your OTP is ${OTP}. Please use this OTP to reset your password.`
            }

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ success: true, message: "OTP sent to your email" });

        } catch (error) {
            console.error("Error sending OTP email:", error);
            res.status(500).json({ success: false, message: error.message });
        }

    } catch (error) {
        console.error("Error in sendResetOtp Controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Reset user password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Your OTP has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiresAt = 0;

        await user.save();
        return res.status(200).json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        console.error("Error in resetPassword controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
