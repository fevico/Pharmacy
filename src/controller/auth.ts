import { RequestHandler } from "express";
import userModel from "src/model/user";
import { generateToken, sendErrorRes } from "src/utils/helper";
import jwt from "jsonwebtoken";

export const createUser: RequestHandler = async (req, res) => {
    const { firstName, lastName, phoneNumber, email, password, role, pharmacyDetails } = req.body;

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return sendErrorRes(res, 'Email already exists', 422);
    }
        const user = new userModel({
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            role,
            pharmacyDetails
        });
        await user.save();
        return res.json({
            message: 'User created successfully', user:{
                firstName,
                lastName,
                phoneNumber,
                email,
                pharmacyDetails,
                role,}})
    }

    // try {
    //     // Check if email already exists
    //     const existingUser = await userModel.findOne({ email });
    //     if (existingUser) {
    //         return sendErrorRes(res, 'Email already exists', 422);
    //     }

    //     // Create user object based on role
    //     let userData: any = { role, createdAt: new Date() };

    //     if (role === 'user') {
    //         userData = {
    //             firstName : firstName,
    //             lastName,
    //             phoneNumber,
    //             email,
    //             password,
    //         };
    //     } else if (role === 'admin') {
    //         userData = {
    //             ...userData,
    //             adminName: firstName, // Assuming `firstName` is used for adminName
    //             adminEmail: email,
    //             adminPassword: password,
    //         };
    //     } else if (role === 'pharmacy') {
    //         userData = {
    //             ...userData,
    //             firstName,
    //             lastName,
    //             phoneNumber,
    //             email,
    //             password,
    //         };
    //     }

    //     // Save the user
    //     const user = new userModel(userData);
    //     await user.save();

export const loginUser: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
        // Check if email exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return sendErrorRes(res, 'Invalid email or password', 401);
        }

        // Check if password is correct
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return sendErrorRes(res, 'Invalid email or password', 401);
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName}, process.env.JWT_SECRET as string, {
            expiresIn: '1d',
        });
        const decoded = jwt.decode(token) as any;
        console.log(decoded)

        res.status(200).json({ token})
}