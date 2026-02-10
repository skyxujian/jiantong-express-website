import { query } from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * User 模型 - 数据库操作
 */

export const User = {
  /**
   * 创建用户
   */
  async create({ email, username, passwordHash }) {
    const id = uuidv4();
    const result = await query(
      `INSERT INTO users (id, email, username, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email, username, created_at`,
      [id, email, username, passwordHash]
    );
    return result.rows[0];
  },

  /**
   * 通过邮箱查找用户
   */
  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  /**
   * 通过用户名查找用户
   */
  async findByUsername(username) {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  },

  /**
   * 通过 ID 查找用户
   */
  async findById(id) {
    const result = await query(
      'SELECT id, email, username, first_name, last_name, kyc_status, two_fa_enabled, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * 检查邮箱是否已存在
   */
  async emailExists(email) {
    const result = await query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    return result.rows.length > 0;
  },

  /**
   * 检查用户名是否已存在
   */
  async usernameExists(username) {
    const result = await query(
      'SELECT id FROM users WHERE username = $1 LIMIT 1',
      [username]
    );
    return result.rows.length > 0;
  },

  /**
   * 更新用户信息
   */
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    });

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  /**
   * 更新最后登录时间
   */
  async updateLastLogin(id) {
    const result = await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING last_login',
      [id]
    );
    return result.rows[0];
  },

  /**
   * 获取用户计数（统计）
   */
  async count() {
    const result = await query('SELECT COUNT(*) as count FROM users');
    return parseInt(result.rows[0].count);
  }
};

export default User;
