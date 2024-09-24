import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: number, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
  });
};

export const generateRefreshToken = (userId: number, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
  });
};
