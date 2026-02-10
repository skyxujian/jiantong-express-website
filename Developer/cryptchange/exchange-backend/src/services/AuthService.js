import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_min_32_chars_long';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret_here_min_32';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '30d';

/**
 * 认证服务
 */
export const AuthService = {
  /**
   * 密码加密
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  /**
   * 验证密码
   */
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  },

  /**
   * 生成 JWT token
   */
  generateToken(userId, email) {
    return jwt.sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
  },

  /**
   * 生成刷新 token
   */
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  },

  /**
   * 验证 JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token 验证失败: ' + error.message);
    }
  },

  /**
   * 验证刷新 token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new Error('刷新 Token 验证失败: ' + error.message);
    }
  },

  /**
   * 用户注册
   */
  async register({ email, username, password }) {
    // 验证邮箱是否已存在
    if (await User.emailExists(email)) {
      throw new Error('邮箱已被注册');
    }

    // 验证用户名是否已存在
    if (await User.usernameExists(username)) {
      throw new Error('用户名已被使用');
    }

    // 密码加密
    const passwordHash = await this.hashPassword(password);

    // 创建用户
    const user = await User.create({
      email,
      username,
      passwordHash
    });

    // 生成 token
    const token = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token,
      refreshToken
    };
  },

  /**
   * 用户登录
   */
  async login({ email, password }) {
    // 查找用户
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await this.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('邮箱或密码错误');
    }

    // 更新最后登录时间
    await User.updateLastLogin(user.id);

    // 生成 token
    const token = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        kyc_status: user.kyc_status
      },
      token,
      refreshToken
    };
  },

  /**
   * 刷新 token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new Error('用户不存在');
      }

      const newToken = this.generateToken(user.id, user.email);
      const newRefreshToken = this.generateRefreshToken(user.id);

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('刷新 Token 失败: ' + error.message);
    }
  },

  /**
   * 验证 token 并返回用户信息
   */
  async validateToken(token) {
    const decoded = this.verifyToken(token);
    const user = await User.findById(decoded.userId);
    return user;
  }
};

export default AuthService;
