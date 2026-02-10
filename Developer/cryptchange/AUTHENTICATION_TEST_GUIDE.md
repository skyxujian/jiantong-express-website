# 🧪 认证系统测试指南

## 测试前准备

### 1. 启动后端服务
```bash
cd /Users/apple/Developer/cryptchange/exchange-backend
npm run dev
```
预期输出：
```
✅ 服务器运行在 http://localhost:3000
📝 环境: development
🗄️ 数据库: crypto_exchange
```

### 2. 启动前端服务
```bash
cd /Users/apple/Developer/cryptchange/exchange-frontend
npm run dev
```
预期输出：
```
➜ Local:   http://localhost:3001
```

## 测试场景

### 场景 1: 用户注册

**步骤：**
1. 打开浏览器 http://localhost:3001
2. 点击右上角"注册"按钮
3. 填写表单：
   - 用户名：`testuser001`
   - 邮箱：`test001@example.com`
   - 密码：`password123`
   - 确认密码：`password123`
4. 点击"注册"

**预期结果：**
- ✅ 注册成功
- ✅ 自动跳转到首页
- ✅ 右上角显示 `👤 testuser001` 和"登出"按钮
- ✅ 浏览器控制台无错误

**测试代码：**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test001@example.com",
    "username": "testuser001",
    "password": "password123"
  }'

# 预期响应:
# {
#   "status": "success",
#   "message": "注册成功",
#   "data": {
#     "user": {
#       "id": "uuid...",
#       "email": "test001@example.com",
#       "username": "testuser001"
#     },
#     "token": "eyJhbGc...",
#     "refreshToken": "eyJhbGc..."
#   }
# }
```

### 场景 2: 用户登录

**步骤：**
1. 在首页点击"登出"
2. 应该自动跳转到登录页
3. 填写登录表单：
   - 邮箱：`test001@example.com`
   - 密码：`password123`
4. 点击"登录"

**预期结果：**
- ✅ 登录成功
- ✅ 自动跳转到首页
- ✅ 显示用户信息

**测试代码：**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test001@example.com",
    "password": "password123"
  }'
```

### 场景 3: JWT Token 验证

**步骤：**
1. 从登录响应中获取 `token`
2. 在请求 header 中使用 token 调用 `/api/auth/me`

**测试代码：**
```bash
TOKEN="eyJhbGc..."  # 从登录响应获取

curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 预期响应:
# {
#   "status": "success",
#   "data": {
#     "id": "uuid...",
#     "email": "test001@example.com",
#     "username": "testuser001",
#     "kyc_status": "pending"
#   }
# }
```

### 场景 4: 无效 Token 拒绝

**步骤：**
使用无效或过期的 token 调用受保护的端点

**测试代码：**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"

# 预期响应 (401):
# {
#   "status": "error",
#   "code": "INVALID_TOKEN",
#   "message": "Token 无效或已过期"
# }
```

### 场景 5: 密码错误

**步骤：**
用错误的密码尝试登录

**测试代码：**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test001@example.com",
    "password": "wrongpassword"
  }'

# 预期响应 (401):
# {
#   "status": "error",
#   "code": "LOGIN_FAILED",
#   "message": "邮箱或密码错误"
# }
```

### 场景 6: 重复邮箱注册

**步骤：**
用已存在的邮箱注册

**测试代码：**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test001@example.com",
    "username": "testuser002",
    "password": "password123"
  }'

# 预期响应 (400):
# {
#   "status": "error",
#   "code": "REGISTER_FAILED",
#   "message": "邮箱已被注册"
# }
```

### 场景 7: Token 刷新

**步骤：**
用 `refreshToken` 获取新的 `token`

**测试代码：**
```bash
REFRESH_TOKEN="eyJhbGc..."  # 从登录响应获取

curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"

# 预期响应:
# {
#   "status": "success",
#   "message": "Token 刷新成功",
#   "data": {
#     "token": "eyJhbGc...",
#     "refreshToken": "eyJhbGc..."
#   }
# }
```

## 浏览器开发者工具检查

打开浏览器 F12 → Application 标签，检查：

**LocalStorage 应该包含：**
```
token: eyJhbGc...
refreshToken: eyJhbGc...
```

**网络请求：**
- ✅ `POST /api/auth/register` → 201
- ✅ `POST /api/auth/login` → 200
- ✅ `GET /api/auth/me` → 200
- ✅ `POST /api/auth/logout` → 200

**浏览器 Console 应该没有错误**

## 调试技巧

### 查看数据库中的用户

```bash
# 连接到数据库
psql crypto_exchange

# 查询用户
SELECT id, email, username, created_at FROM users;

# 或者用 node 脚本
node -e "
import('./exchange-backend/src/models/User.js').then(m => {
  m.default.count().then(console.log)
})
"
```

### 查看后端日志

后端已配置自动日志，所有请求会显示：
```
✅ [时间] POST /api/auth/register - 201 (45ms)
✅ [时间] POST /api/auth/login - 200 (32ms)
✅ [时间] GET /api/auth/me - 200 (15ms)
```

### 常见问题

| 问题 | 解决方案 |
|------|--------|
| CORS 错误 | 检查前端 vite.config.js 中的代理设置 |
| 数据库连接失败 | 检查 .env 文件中的数据库配置 |
| Token 无效 | 检查 JWT_SECRET 是否配置 |
| 前端无法调用 API | 检查浏览器 Network 标签中的请求 |

## 下一步

✅ **认证系统完成！** 现在你可以：

1. **测试各个场景** → 使用上面的测试代码
2. **在 AWS 部署测试** → `git pull` 然后启动服务
3. **开发钱包管理模块** → 需要认证中间件保护的端点

---

**遇到问题？** 检查浏览器控制台和后端日志输出。

