import express from 'express';
import Joi from 'joi';
import AuthService from '../services/AuthService.js';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * 验证 schema
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * @route   POST /api/auth/register
 * @desc    用户注册
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    // 验证输入
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
    }

    // 调用服务
    const result = await AuthService.register(value);

    res.status(201).json({
      status: 'success',
      message: '注册成功',
      data: result
    });
  } catch (err) {
    res.status(err.status || 400).json({
      status: 'error',
      code: err.code || 'REGISTER_FAILED',
      message: err.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    // 验证输入
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
    }

    // 调用服务
    const result = await AuthService.login(value);

    res.status(200).json({
      status: 'success',
      message: '登录成功',
      data: result
    });
  } catch (err) {
    res.status(401).json({
      status: 'error',
      code: err.code || 'LOGIN_FAILED',
      message: err.message
    });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新 JWT token
 * @access  Public
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('缺少 refreshToken', 400, 'MISSING_REFRESH_TOKEN');
    }

    const result = await AuthService.refreshToken(refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Token 刷新成功',
      data: result
    });
  } catch (err) {
    res.status(401).json({
      status: 'error',
      code: err.code || 'REFRESH_FAILED',
      message: err.message
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    用户登出
 * @access  Private
 */
router.post('/logout', authMiddleware, (req, res) => {
  // 登出逻辑：在实际应用中，可能需要将 token 加入黑名单
  // 这里简化处理，客户端删除 token 即可
  res.status(200).json({
    status: 'success',
    message: '登出成功'
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: req.user
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

export default router;
