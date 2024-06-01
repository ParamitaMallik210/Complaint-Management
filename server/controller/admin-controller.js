import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../model/token.js'; // Assuming Token model is in the same directory

dotenv.config();

export const loginAdmin = async (request, response) => {
    const { username, password } = request.body;

    // Hardcoded admin credentials
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username !== adminUsername) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        // Compare the provided password with the hardcoded (hashed) password
        const match = compare(password, adminPassword);

        if (match) {
            const admin = { username: adminUsername, role: 'admin' };
            const accessToken = jwt.sign(admin, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
            const refreshToken = jwt.sign(admin, process.env.REFRESH_SECRET_KEY);

            // Save the refresh token in the database (Token model)
            const newToken = new Token({ token: refreshToken });
            await newToken.save();

            response.status(200).json({ accessToken, refreshToken, username: adminUsername });
        } else {
            response.status(400).json({ msg: 'Password does not match' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error while logging in the admin' });
    }

    


};
