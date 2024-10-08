const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; // Or use process.env.SECRET_KEY if you're using environment variables

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Authenticating token:", token);

    if (!token) {
        console.log("Token not provided");
        return res.status(401).json({ error: 'Token not provided' });
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err);
            return res.status(403).json({ error: 'Token is not valid' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
