import jwt from 'jsonwebtoken';

const { TOKEN_KEY } = process.env;

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from header

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, TOKEN_KEY);  // Verify the token
        
        // Get the current time (in seconds)
        const currentTime = Math.floor(Date.now() / 1000);
        console.log("Current time:", currentTime);
        
        // Compare current time with token expiration time
        if (decoded.exp < currentTime) {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.log("Decoded token:", decoded);  // Log decoded token for debugging

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Token verification error:", error);  // Log any errors
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export default authenticateUser;


