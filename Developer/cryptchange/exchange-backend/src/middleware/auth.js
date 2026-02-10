import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_min_32_chars_long';

/**
 * 认证中间件 - 验证 JWT token
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // 从 header 获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        code: 'NO_TOKEN',
        message: '缺少认证 Token'
      });
    }

    const token = authHeader.substring(7);

    // 验证 token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_TOKEN',
        message: 'Token 无效或已过期'
      });
    }

    // 获取用户信息
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'USER_NOT_FOUND',
        message: '用户不存在'
      });
    }

    // 将用户信息放入 req.user
    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '认证失败'
    });
  }
};

/**
 * 可选认证中间件 - Token 不存在不报错
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
          req.userId = decoded.userId;
        }
      } catch (err) {
        // 忽略错误
      }
    }
  } catch (error) {
    // 忽略错误
  }

  next();
};
