import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/trading/pairs
 * @desc    获取所有交易对
 * @access  Public
 */
router.get('/pairs', (req, res) => {
  res.json({
    message: '获取交易对端点 - TODO',
    status: 'pending',
    pairs: [
      'BTC/USDT',
      'ETH/USDT',
      'BNB/USDT',
      'SOL/USDT',
      'XRP/USDT'
    ]
  });
});

/**
 * @route   GET /api/trading/pairs/:symbol/ticker
 * @desc    获取交易对行情数据
 * @access  Public
 */
router.get('/pairs/:symbol/ticker', (req, res) => {
  res.json({
    message: '获取行情数据端点 - TODO',
    symbol: req.params.symbol,
    status: 'pending'
  });
});

/**
 * @route   GET /api/trading/pairs/:symbol/orderbook
 * @desc    获取订单簿
 * @access  Public
 */
router.get('/pairs/:symbol/orderbook', (req, res) => {
  res.json({
    message: '获取订单簿端点 - TODO',
    symbol: req.params.symbol,
    status: 'pending'
  });
});

/**
 * @route   GET /api/trading/pairs/:symbol/trades
 * @desc    获取最近成交
 * @access  Public
 */
router.get('/pairs/:symbol/trades', (req, res) => {
  res.json({
    message: '获取成交记录端点 - TODO',
    symbol: req.params.symbol,
    status: 'pending'
  });
});

export default router;
