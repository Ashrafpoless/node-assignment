import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';
import query from '../config/db.js';

const userControllers = {
    register: async (req, res) => {
        try {
            const { email, password, verifyPassword } = req.body;
            // Check if email already exists
            const emailExist = await query(
                `SELECT email FROM user WHERE email = ?`,
                [email]
            );
            if (emailExist.length > 0) {
                return res
                    .status(409)
                    .json({ ok: false, message: `Email is already exist` });
            } //else{
            const isEmailValid = validateEmail(email);
            const isPasswordValid = validatePassword(password);
            const isMatch = matchPasswords(password, verifyPassword);
            if (isEmailValid && isPasswordValid && isMatch) {
                // Hash the password
                const hashedPassword = hashPassword(password);
                // Insert the new user into the database
                const newUser = await query(
                    'INSERT INTO user (email, password) VALUES (? , ?) ',
                    [email, hashedPassword]
                );
                return res
                    .status(201)
                    .json({
                        ok: true,
                        message: `User with email: ${email} has registered successfully`
                    });
            } else {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        message: `Email or Password is not valid`
                    });
            }
            // }
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const emailExist = await query(
                `SELECT email FROM user WHERE email = ?`,
                [email]
            );
            if (emailExist.length < 1) {
                return res
                    .status(409)
                    .json({ ok: false, message: `Email does not exist` });
            } else {
                // check password
                const existPassword = await query(
                    `SELECT password FROM user WHERE email = ?`,
                    [email]
                );
                const user = await query(
                    `SELECT email, password FROM user WHERE email = ? `,
                    [email]
                );
                bcrypt.compare(
                    password,
                    existPassword[0].password,
                    (err, isValid) => {
                        if (isValid) {
                            const token = jwt.sign(
                                { user: user },
                                process.env.TOKEN_ACCESS_SECRET
                            );
                            res.cookie('token', token, { httpOnly: true });
                            res.status(200).json({
                                ok: true,
                                message: `logged in successfully`
                            });
                        } else {
                            res.status(409).json({
                                ok: false,
                                message: `Email or password is not correct`
                            });
                        }
                    }
                );
            }
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(302).json({
                ok: true,
                message: `logged in successfully`
            });
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
};

export default userControllers;
