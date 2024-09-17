import jwt from 'jsonwebtoken';

export function generateAccessToken(username) {
    return jwt.sign({data: username}, process.env.TOKEN_SECRET, {expiresIn: '24h'});
}