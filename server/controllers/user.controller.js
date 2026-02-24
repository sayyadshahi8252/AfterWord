import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const registeruser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, username, gender } = req.body;
        if (!fullName || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const checkUsername = await User.findOne({ username });
        if (checkUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const avatarLocalPath = req.file?.path || "";

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            username: username.toLowerCase(),
            email,
            password: hashedPassword,
            gender,
            avatar: avatarLocalPath,
        });
        const createdUser = await User.findById(user._id).select("-password");

        return res.status(201).json({
            message: "User registered successfully",
            user: createdUser
        });

    } catch (error) {
        console.error("Error while registering user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existuser = await User.findOne({ email });
        if (!existuser) {
            return res.status(400).json({ message: "user not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existuser.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Inccorect password" });
        }
        const accessToken = jwt.sign(
            { id: existuser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        )
        const refreshToken = jwt.sign(
            { id: existuser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        )
        await User.findByIdAndUpdate(existuser._id, { token: refreshToken });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
            .status(200).
            json({
                message: "Login successful",
                accessToken,
                user: {
                    id: existuser._id,
                    email: existuser.email,
                    fullName: existuser.fullName,
                    avatar: existuser.avatar,
                    username: existuser.username
                }
            })
    } catch (error) {
        console.error("Error while registering user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const refreshAccessToken=async(req,res)=>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken;
        console.log(incomingRefreshToken)
        if (!incomingRefreshToken) {
            return res.status(401).json({ message: "Unauthorized request" });
        }
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken.id);
        if (!user || incomingRefreshToken !== user.token) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        return res.status(200).json({
            message: "Token refreshed",
            accessToken
        });
    } catch (error) {
        return res.status(401).json({ message: "Token expired or invalid" })
    }
}


export { registeruser, loginuser,refreshAccessToken };