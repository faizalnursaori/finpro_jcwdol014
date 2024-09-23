import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { config as configDotenv } from 'dotenv';

// Load environment variables
configDotenv();

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER, // Ensure this is set in your .env file
    pass: process.env.GMAIL_APP_PASS, // Ensure this is set in your .env file
  },
});
