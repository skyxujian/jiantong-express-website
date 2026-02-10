import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'crypto_exchange',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('❌ 数据库池错误:', err);
});

pool.on('connect', () => {
  console.log('✅ 数据库连接成功');
});

/**
 * 执行查询
 */
export const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 执行查询:', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ 查询错误:', { text: text.substring(0, 50), error: error.message });
    throw error;
  }
};

/**
 * 获取连接（用于事务）
 */
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

/**
 * 健康检查
 */
export const checkHealth = async () => {
  try {
    const result = await query('SELECT NOW()');
    return { status: 'connected', time: result.rows[0].now };
  } catch (error) {
    return { status: 'disconnected', error: error.message };
  }
};

export default pool;
