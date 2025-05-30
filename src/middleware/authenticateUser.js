import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        // Correctly assign userId from the decoded token.
        // createToken uses user._id as userId in the token payload.
        req.user = {
            userId: decoded.userId, 
            role: decoded.role,
        };
        
        // Ensure that a response is not already sent before calling next()
        // This check itself is a bit unusual here, as next() should be called unless a response is sent.
        // If headersSent is true here, it implies a response was sent *before* authentication finished, which is problematic.
        if (!res.headersSent) {
            next(); // Call next() only if no response has been sent
        } else {
            // This case should ideally not be reached if middleware flow is correct.
            console.error("authenticateUser: Headers already sent before next() was called. This indicates a potential issue in middleware order or logic.");
        }
    } catch (error) {
        // Handle token verification errors (e.g., invalid signature, expired token)
        if (res.headersSent) {
            // If headers are already sent, it's too late to send a proper error response to the client.
            // Log the error on the server for debugging.
            console.error("authenticateUser: Error verifying token, but headers already sent. Client will likely not receive this error.", error);
        } else {
            // Send a 401 Unauthorized response if token is invalid and no response has been started.
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    }
}

export default authenticateUser;
