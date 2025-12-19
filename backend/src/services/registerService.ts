import bcrypt from 'bcrypt';
import { findUserByEmailOrUsername, createUserInDB } from '../models/userModel';
import { CreateUserDTO, User } from '../types/user';

export const registerUser = async (userData: CreateUserDTO): Promise<User> => {
    const { email, username, password } = userData;

    // Check if user already exists
    const existingUser = await findUserByEmailOrUsername(email, username);

    if (existingUser) {
        // Check which one failed to give a more precise message (optional)
        if (existingUser.email === email) {
            throw new Error('User with this email already exists');
        }
        if (existingUser.username === username) {
            throw new Error('User with this username already exists');
        }
        // Generic fallback that your controller expects
        throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in DB
    const newUser = await createUserInDB({
        ...userData,
        password: hashedPassword
    });

    return newUser;
};