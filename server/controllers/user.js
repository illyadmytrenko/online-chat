import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default {
  async register(req, res) {
    try {
      const { name, nickname, email, password, userId } = req.body;

      if (!name || !nickname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const existingUser = await User.findOne({ userEmail: email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const existingNickname = await User.findOne({ userNickname: nickname });
      if (existingNickname) {
        return res.status(400).json({ message: 'Nickname is already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        userName: name,
        userNickname: nickname,
        userEmail: email,
        userHashedPassword: hashedPassword,
        userId,
      });

      const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.userId,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  async login(req, res) {
    try {
      const { nickname, password } = req.body;

      const user = await User.findOne({ userNickname: nickname });
      if (!user) {
        return res.status(400).json({ message: 'No user with such nickname found' });
      }

      const isValidPassword = await bcrypt.compare(password, user.userHashedPassword);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Wrong password' });
      }

      const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'User logged in successfully',
        user: {
          id: user.userId,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async getUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findOne({ userId });

      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
      s;
    }
  },
  async getUserByNickname(req, res) {
    try {
      const { userNickname } = req.params;

      const user = await User.findOne({ userNickname });

      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
