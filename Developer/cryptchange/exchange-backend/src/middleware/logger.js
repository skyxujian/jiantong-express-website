/**
 * 请求日志中间件
 */

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusEmoji = status >= 400 ? '❌' : '✅';

    console.log(
      `${statusEmoji} [${new Date().toISOString()}] ${req.method} ${req.path} - ${status} (${duration}ms)`
    );
  });

  next();
};
