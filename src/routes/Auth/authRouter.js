import express from 'express';
import passport from '../../config/passportConfig.js';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Route to start Google OAuth authentication
router.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with Google<a>")
});

router.get("/google", passport.authenticate('google', {scope: ["Profile", "email"]} ))

router.get("/google/callback", passport.authenticate('google', {failureRedirect: "/" }), (req, res) => {
    res.send(`Welcome ${req.user.displayName}`);
});

// Apply CSRF protection to the POST logout route
router.post("/logout", csrfProtection, (req, res, next) => {
    req.logout(function(err) {
        if (err) { 
            // It's good practice to log the error and perhaps send an error response
            console.error("Logout error:", err);
            // Depending on how you want to handle errors, you might send a status
            // or redirect to an error page. For now, continue to redirect.
            // Consider what to do if headers are already sent by csrf middleware error handler
            if (res.headersSent) {
                return next(err); // Pass to default error handler if response started
            }
            return res.status(500).json({ message: "Error during logout."});
        }
        res.redirect("/");
    });
});

// Route to get CSRF token (optional, for SPAs or forms that need it dynamically)
// This should be a GET request and also needs CSRF protection to generate a token.
router.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

export default router;