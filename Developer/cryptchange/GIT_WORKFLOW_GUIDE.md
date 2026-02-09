# 🔄 Git + 网页终端混合开发工作流

## 📋 工作流程概览

```
本地 Mac (开发)
    ↓ git push
GitHub (代码仓库)
    ↓ git pull
AWS 服务器 (运行)
```

---

## 🚀 第一步：在服务器上配置 Git

### 在 AWS 网页终端执行：

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装必要工具
sudo apt install -y git curl wget vim

# 3. 配置 Git
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# 4. 生成 SSH 密钥（用于 GitHub）
ssh-keygen -t ed25519 -C "your-email@example.com"
# 一路回车使用默认设置

# 5. 查看公钥
cat ~/.ssh/id_ed25519.pub
# 复制这个公钥
```

### 添加公钥到 GitHub：

1. 打开 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴刚才复制的公钥
4. 点击 "Add SSH key"

### 测试 GitHub 连接：

```bash
ssh -T git@github.com
# 应该看到：Hi username! You've successfully authenticated...
```

---

## 🛠️ 第二步：在服务器上克隆项目

```bash
# 1. 进入工作目录
cd ~

# 2. 克隆你的项目
git clone git@github.com:skyxujian/jiantong-express-website.git

# 3. 进入项目目录
cd jiantong-express-website/Developer/cryptchange

# 4. 查看文件
ls -la
```

---

## 💻 第三步：安装开发环境

### 在服务器上执行：

```bash
# 1. 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. 验证安装
node --version
npm --version

# 3. 安装 Docker
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# 4. 安装 Docker Compose
sudo apt install -y docker-compose

# 5. 重新登录以使 docker 组生效
exit
# 然后重新通过网页终端登录
```

---

## 🔄 第四步：日常开发工作流

### 在本地 Mac 开发：

```bash
# 1. 进入项目目录
cd /Users/apple/Developer/cryptchange

# 2. 编写代码
# ... 编辑文件 ...

# 3. 提交到 Git
git add .
git commit -m "feat: add user authentication"
git push origin main
```

### 在服务器上部署：

**在网页终端执行**：

```bash
# 1. 进入项目目录
cd ~/jiantong-express-website/Developer/cryptchange

# 2. 拉取最新代码
git pull origin main

# 3. 安装依赖（如果有新的）
npm install

# 4. 启动服务
npm run dev
# 或
docker-compose up -d
```

---

## 📊 第五步：查看和管理服务

### 在网页终端：

```bash
# 查看运行的进程
ps aux | grep node

# 查看 Docker 容器
docker ps

# 查看日志
docker logs -f container_name
# 或
tail -f /path/to/log/file.log

# 停止服务
docker-compose down
# 或
pkill -f "node"
```

---

## 🎯 实用技巧

### 1. 使用 screen 或 tmux 保持会话

```bash
# 安装 screen
sudo apt install -y screen

# 创建新会话
screen -S myapp

# 在 screen 中运行应用
npm run dev

# 断开会话：Ctrl+A 然后按 D

# 重新连接
screen -r myapp

# 列出所有会话
screen -ls
```

### 2. 设置环境变量

```bash
# 编辑 .env 文件
cd ~/jiantong-express-website/Developer/cryptchange
nano .env

# 添加：
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
```

### 3. 自动启动服务

```bash
# 创建 systemd 服务
sudo nano /etc/systemd/system/cryptchange.service

# 内容：
[Unit]
Description=Crypto Exchange Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/jiantong-express-website/Developer/cryptchange
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target

# 启用服务
sudo systemctl enable cryptchange
sudo systemctl start cryptchange
sudo systemctl status cryptchange
```

---

## 📱 本地快捷命令

创建快捷脚本 `deploy.sh`：

```bash
#!/bin/bash

echo "🚀 部署到 AWS..."

# 提交代码
git add .
git commit -m "${1:-update}"
git push origin main

echo "✅ 代码已推送到 GitHub"
echo "📝 请在 AWS 网页终端执行: git pull origin main"
```

使用：
```bash
chmod +x deploy.sh
./deploy.sh "feat: add new feature"
```

---

## 🔧 常用命令速查

### Git 命令

```bash
# 查看状态
git status

# 拉取最新代码
git pull origin main

# 提交代码
git add .
git commit -m "message"
git push origin main

# 查看日志
git log --oneline -10

# 撤销修改
git checkout -- filename
```

### 服务管理

```bash
# 启动
npm start
# 或
docker-compose up -d

# 停止
pkill -f node
# 或
docker-compose down

# 重启
docker-compose restart

# 查看日志
docker-compose logs -f
```

### 系统管理

```bash
# 查看磁盘空间
df -h

# 查看内存
free -h

# 查看进程
top
htop

# 查看端口
sudo netstat -tulpn | grep :3000
```

---

## ✅ 验证配置

在服务器上执行以下命令验证：

```bash
echo "=== 环境检查 ==="

# Node.js
echo "Node.js: $(node --version)"

# npm
echo "npm: $(npm --version)"

# Git
echo "Git: $(git --version)"

# Docker
echo "Docker: $(docker --version)"

# GitHub 连接
echo "GitHub SSH:"
ssh -T git@github.com 2>&1 | head -1

echo "=== 检查完成 ==="
```

---

## 🎓 下一步

1. **立即执行**：在网页终端配置 Git 和开发环境
2. **测试工作流**：本地改代码 → push → 服务器 pull
3. **部署第一个服务**：运行 hello world
4. **监控和调试**：学习使用 screen 和日志查看

准备好了吗？从网页终端的第一步开始！🚀

