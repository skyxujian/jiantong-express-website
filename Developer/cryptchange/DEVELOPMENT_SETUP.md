# 🚀 开发快速开始

## 项目结构

```
/cryptchange
├── exchange-backend/          # Express.js 后端
│   ├── src/
│   │   ├── index.js          # 主应用入口
│   │   ├── routes/           # API 路由
│   │   ├── middleware/       # 中间件
│   │   └── database/         # 数据库相关
│   ├── package.json
│   └── Dockerfile
│
├── exchange-frontend/         # React 前端
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   ├── components/       # 公用组件
│   │   └── styles/           # 样式表
│   ├── package.json
│   └── vite.config.js
│
└── [文档文件]
```

## 第一步：本地开发环境设置

### 后端设置

```bash
# 进入后端目录
cd exchange-backend

# 安装依赖
npm install

# 创建 .env 文件
cp .env.example .env
# 编辑 .env 填入本地 PostgreSQL 和 Redis 连接信息

# 启动后端（开发模式）
npm run dev
# 服务器运行在 http://localhost:3000
```

### 前端设置

```bash
# 在另一个终端进入前端目录
cd exchange-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 打开 http://localhost:3001
```

## 第二步：数据库初始化

```bash
# 连接到 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE crypto_exchange;

# 导入 schema
psql -U postgres crypto_exchange < ../exchange-backend/src/database/schema.sql
```

## API 端点测试

### 健康检查
```bash
curl http://localhost:3000/health
```

### 注册用户
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 获取交易对
```bash
curl http://localhost:3000/api/trading/pairs
```

## 下一步开发任务

### Week 1-2: 后端核心功能
- [ ] 用户认证系统 (JWT + 2FA)
- [ ] 钱包管理服务
- [ ] 数据库操作层
- [ ] API 安全中间件

### Week 3-4: 区块链集成
- [ ] Ethers.js 集成
- [ ] 钱包签名系统
- [ ] 链上交易验证

### Week 5-6: 前端开发
- [ ] 交易界面
- [ ] 实时行情更新 (WebSocket)
- [ ] 钱包管理界面
- [ ] 用户认证流程

### Week 7-8: 交易引擎
- [ ] 订单簿管理
- [ ] 订单匹配算法
- [ ] 交易执行逻辑

## 快速命令参考

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（带热重载） |
| `npm run build` | 构建生产版本 |
| `npm test` | 运行测试 |
| `npm start` | 启动生产服务器 |

## 调试技巧

### 查看后端日志
```bash
# 已启用日志中间件，所有请求会显示在控制台
# 日志格式: [时间] METHOD PATH - STATUS (耗时)
```

### 测试 API
```bash
# 推荐使用 VS Code REST Client 或 Postman
# 或直接在浏览器中测试 GET 请求
```

## 部署到 AWS

见 [GIT_WORKFLOW_GUIDE.md](GIT_WORKFLOW_GUIDE.md) 中的部署步骤。

---

**遇到问题？** 查看相关文档或检查错误日志。

