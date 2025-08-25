import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../config/db.js';

// User Registration
export const register = async (req, res) => {
  console.log('📝 Register request received:', req.body);

  const { first_name, last_name, username, email, password } = req.body;
  
  // Validation
  if (!first_name || !last_name || !username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill all required fields' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please enter a valid email address' 
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters long' 
    });
  }

  try {
    const db = getDatabase();
    
    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM app_users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await db.query(
      'INSERT INTO app_users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, username, email, hashedPassword]
    );

    console.log('✅ User registered successfully with ID:', result.insertId);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: result.insertId
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// User Login
export const login = async (req, res) => {
  console.log('🔐 Login request received:', { email: req.body.email });

  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide email and password' 
    });
  }

  try {
    const db = getDatabase();
    
    // Check if user exists
    const [users] = await db.query(
      'SELECT id, first_name, last_name, username, email, password FROM app_users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        username: user.username 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from user object before sending response
    const { password: userPassword, ...userWithoutPassword } = user;
    
    console.log('✅ User logged in successfully:', user.email);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get User Profile
export const getProfile = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const db = getDatabase();
    
    const [users] = await db.query(
      'SELECT id, first_name, last_name, username, email, created_at FROM app_users WHERE id = ?', 
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      user: users[0]
    });
    
  } catch (error) {
    console.error('❌ Get profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};