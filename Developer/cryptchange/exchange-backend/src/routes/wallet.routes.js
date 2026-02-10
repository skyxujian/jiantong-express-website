import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/wallets
 * @desc    获取用户所有钱包
 * @access  Private
 */
router.get('/', (req, res) => {
  res.json({
    message: '获取钱包列表端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   POST /api/wallets
 * @desc    创建新钱包
 * @access  Private
 */
router.post('/', (req, res) => {
  res.json({
    message: '创建钱包端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   GET /api/wallets/:id/balance
 * @desc    获取钱包余额
 * @access  Private
 */
router.get('/:id/balance', (req, res) => {
  res.json({
    message: '获取钱包余额端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   POST /api/wallets/:id/deposit
 * @desc    充值到钱包
 * @access  Private
 */
router.post('/:id/deposit', (req, res) => {
  res.json({
    message: '充值端点 - TODO',
    status: 'pending'
  });
});

/**
 * @route   POST /api/wallets/:id/withdraw
 * @desc    从钱包提现
 * @access  Private
 */
router.post('/:id/withdraw', (req, res) => {
  res.json({
    message: '提现端点 - TODO',
    status: 'pending'
  });
});

export default router;
