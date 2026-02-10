import express from 'express';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    用户注册
 * @access  Public
 */
router.post('/register', (req, res) => {
  res.json({
    message: '用户注册端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', (req, res) => {
  res.json({
    message: '用户登录端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新 JWT token
 * @access  Public
 */
router.post('/refresh', (req, res) => {
  res.json({
    message: '刷新 token 端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    用户登出
 * @access  Private
 */
router.post('/logout', (req, res) => {
  res.json({
    message: '用户登出端点 - TODO',
    status: 'pending'
  });
});

export default router;
