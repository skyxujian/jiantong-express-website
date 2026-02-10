# 📦 本地开发完整指南

## 当前进度

✅ **后端框架**: Express.js + Node.js 18  
✅ **前端框架**: React 18 + Vite  
✅ **依赖安装**: 全部完成  
✅ **后端测试**: 服务器启动成功  

## 快速开发步骤

### 1️⃣ 终端窗口 #1 - 启动后端

```bash
cd /Users/apple/Developer/cryptchange/exchange-backend

# 启动后端（开发模式，支持热重载）
npm run dev

# 预期输出:
# ✅ 服务器运行在 http://localhost:3000
# 📝 环境: development
```

**测试后端是否运行**:
```bash
# 在另一个终端测试
curl http://localhost:3000/health

# 预期响应:
# {"status":"ok","timestamp":"2026-02-10T...","version":"0.1.0"}
```

### 2️⃣ 终端窗口 #2 - 启动前端

```bash
cd /Users/apple/Developer/cryptchange/exchange-frontend

# 启动前端开发服务器
npm run dev

# 预期输出:
# ➜  Local:   http://localhost:3001
# ➜  Press q to quit
```

**打开浏览器**:
- 访问 http://localhost:3001
- 你会看到加密货币交易所的首页

### 3️⃣ 开始编写代码

#### 后端开发示例

编辑 [exchange-backend/src/routes/auth.routes.js](exchange-backend/src/routes/auth.routes.js):

```javascript
// 现在的状态：只有占位符端点
// TODO: 实现真实的用户认证逻辑

// 需要添加:
// 1. 密码加密 (bcryptjs)
// 2. JWT token 生成
// 3. 数据库查询
// 4. 错误处理
```

#### 前端开发示例

编辑 [exchange-frontend/src/pages/Home.jsx](exchange-frontend/src/pages/Home.jsx):

```jsx
// 现在的状态：静态页面
// TODO: 添加实时数据

// 需要添加:
// 1. API 调用获取行情数据
// 2. WebSocket 连接实时更新
// 3. 图表组件
// 4. 用户认证检查
```

## 数据库设置（可选）

如果你想在本地测试数据库功能：

```bash
# 1. 安装 PostgreSQL（如果还没安装）
brew install postgresql

# 2. 启动 PostgreSQL
brew services start postgresql

# 3. 创建数据库
createdb crypto_exchange

# 4. 导入 schema
psql crypto_exchange < /Users/apple/Developer/cryptchange/exchange-backend/src/database/schema.sql

# 5. 更新 .env 文件中的数据库连接
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=crypto_exchange
# DB_USER=postgres (macOS 默认)
# DB_PASSWORD= (通常为空)
```

## 开发工作流

### 日常工作流程

```
1. 编写代码 (本地编辑器)
   ↓
2. 测试功能 (浏览器 + 后端 API)
   ↓
3. 提交到 Git
   git add .
   git commit -m "feat: implement user authentication"
   git push origin main
   ↓
4. 在 AWS 服务器拉取最新代码
   ssh instance-connect: git pull origin main
   ↓
5. 验证部署
   curl https://your-domain/health
```

## API 端点参考

### 已有的端点框架（都需要实现）

```
认证系统:
  POST   /api/auth/register        - 用户注册
  POST   /api/auth/login           - 用户登录
  POST   /api/auth/refresh         - 刷新 Token
  POST   /api/auth/logout          - 用户登出

用户管理:
  GET    /api/users/profile        - 获取用户信息
  PUT    /api/users/profile        - 更新用户信息
  POST   /api/users/2fa/enable     - 启用双因素认证
  POST   /api/users/2fa/verify     - 验证 2FA 代码

钱包管理:
  GET    /api/wallets              - 获取所有钱包
  POST   /api/wallets              - 创建新钱包
  GET    /api/wallets/:id/balance  - 获取钱包余额
  POST   /api/wallets/:id/deposit  - 充值
  POST   /api/wallets/:id/withdraw - 提现

订单系统:
  GET    /api/orders               - 获取订单列表
  POST   /api/orders               - 创建订单
  GET    /api/orders/:id           - 获取订单详情
  DELETE /api/orders/:id           - 取消订单

交易行情:
  GET    /api/trading/pairs        - 获取所有交易对
  GET    /api/trading/pairs/:symbol/ticker    - 获取行情
  GET    /api/trading/pairs/:symbol/orderbook - 获取订单簿
  GET    /api/trading/pairs/:symbol/trades    - 获取成交记录
```

## 推荐的实现顺序

### 第 1 周：用户认证

1. ✅ 创建 User 模型和数据库表
2. ✅ 实现用户注册端点
3. ✅ 实现用户登录端点 (JWT)
4. ✅ 实现前端登录/注册页面
5. ✅ 添加认证中间件

### 第 2 周：钱包管理

1. ✅ 创建 Wallet 模型
2. ✅ 集成 Ethers.js 生成钱包
3. ✅ 实现钱包创建端点
4. ✅ 实现余额查询
5. ✅ 前端钱包页面

### 第 3 周：交易系统

1. ✅ 创建 Order 和 Trade 模型
2. ✅ 实现订单创建端点
3. ✅ 实现订单匹配引擎
4. ✅ 前端交易页面
5. ✅ WebSocket 实时推送

### 第 4 周：区块链集成

1. ✅ Ethers.js 连接测试网
2. ✅ 交易签名和广播
3. ✅ 确认机制
4. ✅ 充提系统

## 调试技巧

### 查看后端日志

后端已配置自动日志中间件，所有请求都会显示：

```
✅ [时间] POST /api/auth/login - 200 (45ms)
❌ [时间] GET /api/wallets - 401 (12ms)
```

### 测试 API 的三种方式

**方式 1: curl 命令**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

**方式 2: VS Code REST Client 扩展**
创建文件 `test.rest`:
```
POST http://localhost:3000/api/auth/register HTTP/1.1
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**方式 3: Postman**
- 创建新请求
- 方法: POST
- URL: http://localhost:3000/api/auth/register
- Body: JSON 格式

### 查看前端问题

打开浏览器开发者工具 (F12):
- **Console**: 查看 JavaScript 错误
- **Network**: 查看 API 请求和响应
- **Application**: 查看 LocalStorage 和 Cookie

## 遇到问题？

| 问题 | 解决方案 |
|------|--------|
| 后端启动失败 | 检查端口 3000 是否被占用：`lsof -i :3000` |
| 前端无法连接后端 | 检查 CORS 设置和代理配置 |
| 依赖版本冲突 | 删除 `node_modules` 和 `package-lock.json`，重新 `npm install` |
| 数据库连接失败 | 检查 .env 文件中的 DB_* 变量 |
| 找不到 npm 命令 | 确保 Node.js 已安装：`node --version` |

## 下一步

1. **选择一个功能开始实现** → 比如用户认证
2. **编写后端逻辑** → 验证、加密、数据库操作
3. **测试 API** → 用 curl 或 Postman 验证
4. **创建前端页面** → 调用后端 API
5. **提交到 GitHub** → `git push origin main`
6. **在 AWS 上测试** → `git pull` 并验证

---

**准备好开始了吗？** 选择一个功能，开始编码吧！🚀

