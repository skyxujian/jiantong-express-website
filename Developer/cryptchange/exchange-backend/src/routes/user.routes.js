import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    获取用户信息
 * @access  Private
 */
router.get('/profile', (req, res) => {
  res.json({
    message: '获取用户信息端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   PUT /api/users/profile
 * @desc    更新用户信息
 * @access  Private
 */
router.put('/profile', (req, res) => {
  res.json({
    message: '更新用户信息端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   POST /api/users/2fa/enable
 * @desc    启用双因素认证
 * @access  Private
 */
router.post('/2fa/enable', (req, res) => {
  res.json({
    message: '启用 2FA 端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   POST /api/users/2fa/verify
 * @desc    验证 2FA 代码
 * @access  Private
 */
router.post('/2fa/verify', (req, res) => {
  res.json({
    message: '验证 2FA 端点 - TODO',
    status: 'pending'
  });
});

export default router;
