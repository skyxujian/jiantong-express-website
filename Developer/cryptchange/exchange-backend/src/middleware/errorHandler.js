/**
 * 错误处理中间件
 */

export const notFound = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `路由未找到: ${req.originalUrl}`,
      path: req.originalUrl,
      method: req.method
    }
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('❌ 错误:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || '内部服务器错误';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export class AppError extends Error {
  constructor(message, status = 500, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}
