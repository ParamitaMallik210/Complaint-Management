import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js'
import User from '../model/user.js';

dotenv.config();

export const singupUser = async (request, response) => {
    try {
        // const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const user = { username: request.body.username, name: request.body.name, password: hashedPassword }

        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}


export const loginUser = async (request, response) => {
    console.log(request.body);
    if(request.body.role === 'admin') {
        let user = {
            username: process.env.ADMIN_USERNAME,
           password: process.env.ADMIN_PASSWORD,
            role: "admin"
        }
        if (user.username!==request.body.username)  {
            console.log("no");
            return response.status(400).json({ msg: 'Username does not match' });
            
        }
            console.log("done");
        try {
            let match = user.password===request.body.password;
            console.log(match);
            if (match) {
                const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
                console.log(accessToken);
                const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY);
                console.log(refreshToken);
                const newToken = new Token({ token: refreshToken });
                await newToken.save();
               
                response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.username, password: user.password,role: user.role,username: user.username});
            
            } else {
                response.status(400).json({ msg: 'Password does not match' })
            }
        } catch (error) {
            response.status(500).json({ msg: 'error while login the user' })
        }
    }
    else{
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username });
        
        } else {
            response.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        response.status(500).json({ msg: 'error while login the user' })
    }
}
}

export const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token: token });

    response.status(204).json({ msg: 'logout successfull' });
}