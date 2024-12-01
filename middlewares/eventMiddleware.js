// Import modules
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken'
import Events from '../models/Events.js';

const protect = asyncHandler(async (req, res, next) => {
    // Get the access token from cookies
    const accessToken = req.cookies.accessToken;

    // Debugging: Check if the token is present
    if (!accessToken) {
        console.log('No token found in cookies');
        return res.status(401).json({
            success: false,
            message: 'Not Authorized, Access Token not found',
        });
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        
        // Debugging: Check the decoded token
        console.log('Decoded Token:', decoded);

        // Attach user to the request object
        req.user = await Events.findById(decoded._id).select('-password'); // Exclude password

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        next();
    } catch (error) {
        console.error('Token verification error:', error); // Log the error details

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Access Token expired, please login again or use refresh token',
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Not Authorized, Invalid Access Token',
        });
    }
});

export default protect;