const celebModel = require("../models/celeb.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
    try {
        const { name, email, password, platforms, description } = req.body;

        console.log("Register Request Body:", req.body);

        if (!name || !email || !password || !platforms || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user exists
        const existingUser = await celebModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new celebModel({ name, email, password: hashedPassword, platforms, description });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("New User Created:", newUser);

        // Set cookie
        res.cookie("token", token, { httpOnly: true });

        // Remove password before sending response
        newUser.password = undefined;

        res.status(201).json({ token, newUser });

    } catch (error) {
        console.error("Error in Register:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login Request Body:", req.body);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await celebModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        console.log("User Found:", user);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Token Generated:", token);

        res.cookie("token", token, { httpOnly: true });

        // Remove password before sending response
        user.password = undefined;

        res.json({ token, user });

    } catch (error) {
        console.error("Error in Login:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.profile = async (req, res) => {
    try {
        console.log("Profile route hit"); // Debugging
        console.log("User data:", req.celeb); // Debugging
        
        res.send(req.celeb);  // Send user data as response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

