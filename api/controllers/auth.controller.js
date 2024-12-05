import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    
    const {username, email, password} = req.body;


    try{
    //hash
    const hasgedPassword = bcrypt.hashSync(password, 10);

    //crearte user
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hasgedPassword
        }
    });

        res.status(201).json({message: "User created"});
    } catch (error) {
        return res.status(500).json({message: "Error creating user"});
    }
   

}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login attempt with username:', username);

        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            console.log('User not found!');
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

       // console.log('User found:', user);

        // Verify password
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            console.log('Invalid password!');
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        //console.log('Password verified.');

        // Generate JWT token
        const age = 24 * 60 * 60 * 7; // 7 days in seconds
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );

        //console.log('Generated Token:', token);

        // Set token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: age * 1000, // Convert seconds to milliseconds
        }).status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Error logging in', error });
    }
};


export const logout = (req, res) => {
   res.clearCookie('token').status(200).json({message: 'Logged out successfully'});
}