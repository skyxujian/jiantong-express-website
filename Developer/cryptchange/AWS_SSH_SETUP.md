# 🔐 AWS SSH 连接配置指南

> 你的密钥文件已配置完成！

---

## ✅ 已完成的配置

### 1. 密钥文件设置
- **文件路径**: `/Users/apple/Developer/cryptchange/awsexchange/my-key.pem`
- **权限**: `400` (只读) ✅
- **状态**: 可用

---

## 🚀 连接到 AWS 服务器

### 方法 1：直接连接（需要服务器信息）

```bash
# 基本连接命令格式
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem 用户名@服务器IP
```

**示例**：
```bash
# Amazon Linux
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ec2-user@your-ec2-ip

# Ubuntu
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ubuntu@your-ec2-ip
```

### 方法 2：使用 SSH 配置文件（推荐）

编辑 `~/.ssh/config` 添加以下内容：

```bash
# AWS 加密货币交易所服务器
Host aws-cryptchange
    HostName YOUR_EC2_IP_OR_DNS_HERE
    User ec2-user
    IdentityFile /Users/apple/Developer/cryptchange/awsexchange/my-key.pem
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null

# 如果有多台服务器
Host aws-cryptchange-db
    HostName YOUR_DB_IP_HERE
    User ec2-user
    IdentityFile /Users/apple/Developer/cryptchange/awsexchange/my-key.pem
    ServerAliveInterval 60
```

配置后，简单地连接：
```bash
ssh aws-cryptchange
```

---

## 📋 需要的服务器信息

为了完成配置，你需要提供：

### 1️⃣ AWS EC2 实例的 IP 或域名
- **公网 IP** (例如: `18.xxx.xxx.xxx`)
- 或 **公网 DNS** (例如: `ec2-18-xxx-xxx-xxx.ap-northeast-1.compute.amazonaws.com`)

**如何获取**：
- 登录 AWS 控制台
- EC2 Dashboard → Instances
- 选择你的实例
- 查看 "Public IPv4 address" 或 "Public IPv4 DNS"

### 2️⃣ 用户名

常见的用户名：
- **Amazon Linux 2 / Amazon Linux 2023**: `ec2-user`
- **Ubuntu**: `ubuntu`
- **CentOS**: `centos`
- **Debian**: `admin` 或 `ubuntu`
- **RHEL**: `ec2-user`

**如何确认**：
- 查看你创建 EC2 时选择的 AMI (操作系统镜像)
- 在 AWS 控制台 Connect 按钮会显示用户名

---

## 🔧 快速测试连接

### 测试 1：验证密钥文件

```bash
# 查看密钥指纹
ssh-keygen -l -f /Users/apple/Developer/cryptchange/awsexchange/my-key.pem
```

### 测试 2：测试连接（需要服务器 IP）

```bash
# 替换 YOUR_IP 为实际 IP
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem -v ec2-user@YOUR_IP
```

`-v` 参数会显示详细的连接过程，帮助排查问题。

---

## 🛠️ 常见问题解决

### 问题 1: "Permission denied (publickey)"

**原因**: 用户名错误或密钥不匹配

**解决**:
```bash
# 尝试不同的用户名
ssh -i /path/to/key.pem ubuntu@your-ip
ssh -i /path/to/key.pem ec2-user@your-ip
ssh -i /path/to/key.pem admin@your-ip
```

### 问题 2: "WARNING: UNPROTECTED PRIVATE KEY FILE!"

**原因**: 密钥文件权限不正确

**解决**:
```bash
chmod 400 /Users/apple/Developer/cryptchange/awsexchange/my-key.pem
```
✅ 已完成

### 问题 3: "Connection timed out"

**原因**: 
- 安全组未开放 SSH 端口 (22)
- VPN 未连接
- IP 地址错误

**解决**:
1. 检查 AWS 安全组是否允许你的 IP 访问端口 22
2. 确保 VPN 已连接（如果服务器在国外）
3. 验证 IP 地址是否正确

### 问题 4: "Host key verification failed"

**原因**: 服务器密钥变化

**解决**:
```bash
# 删除旧的主机密钥
ssh-keygen -R your-server-ip

# 或使用配置忽略（不推荐生产环境）
ssh -o StrictHostKeyChecking=no -i /path/to/key.pem user@ip
```

---

## 📝 自动化 SSH 配置脚本

创建配置脚本 `setup-aws-ssh.sh`:

```bash
#!/bin/bash

# AWS SSH 配置脚本

echo "🔐 配置 AWS SSH 连接..."

# 读取服务器信息
read -p "输入 AWS EC2 IP 或 DNS: " EC2_HOST
read -p "输入用户名 (默认 ec2-user): " EC2_USER
EC2_USER=${EC2_USER:-ec2-user}

# 配置文件路径
SSH_CONFIG="$HOME/.ssh/config"
KEY_FILE="/Users/apple/Developer/cryptchange/awsexchange/my-key.pem"

# 备份现有配置
if [ -f "$SSH_CONFIG" ]; then
    cp "$SSH_CONFIG" "$SSH_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
fi

# 添加配置
cat >> "$SSH_CONFIG" << EOF

# AWS 加密货币交易所服务器
Host aws-cryptchange
    HostName $EC2_HOST
    User $EC2_USER
    IdentityFile $KEY_FILE
    ServerAliveInterval 60
    ServerAliveCountMax 3

EOF

echo "✅ SSH 配置已添加到 $SSH_CONFIG"
echo ""
echo "现在可以使用以下命令连接:"
echo "  ssh aws-cryptchange"
echo ""
echo "或者直接使用:"
echo "  ssh -i $KEY_FILE $EC2_USER@$EC2_HOST"
```

使用方法:
```bash
chmod +x setup-aws-ssh.sh
./setup-aws-ssh.sh
```

---

## 🎯 下一步操作

### 1. 获取 AWS 服务器信息

登录 AWS 控制台：
1. 打开 https://console.aws.amazon.com/
2. 进入 EC2 Dashboard
3. 找到你的实例
4. 复制公网 IP 或 DNS

### 2. 测试连接

```bash
# 替换 YOUR_IP 和用户名
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ec2-user@YOUR_IP
```

### 3. 成功连接后

安装必要的软件：
```bash
# 更新系统
sudo yum update -y  # Amazon Linux
# 或
sudo apt update && sudo apt upgrade -y  # Ubuntu

# 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs  # Amazon Linux
# 或
sudo apt install -y nodejs npm  # Ubuntu

# 安装 Git
sudo yum install -y git  # Amazon Linux
# 或
sudo apt install -y git  # Ubuntu

# 安装 Docker
sudo yum install -y docker  # Amazon Linux
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
```

---

## 🔄 文件传输

### 从本地传到服务器

```bash
# 传输单个文件
scp -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem \
    local-file.txt \
    ec2-user@YOUR_IP:/home/ec2-user/

# 传输整个目录
scp -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem \
    -r local-folder \
    ec2-user@YOUR_IP:/home/ec2-user/
```

### 从服务器下载到本地

```bash
# 下载单个文件
scp -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem \
    ec2-user@YOUR_IP:/path/to/file \
    ./local-destination/

# 下载整个目录
scp -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem \
    -r ec2-user@YOUR_IP:/path/to/folder \
    ./local-destination/
```

---

## 🎓 提供你的服务器信息

**请提供以下信息以完成配置**：

1. **AWS EC2 公网 IP** 或 **公网 DNS**: `___________________`
2. **操作系统类型**: 
   - [ ] Amazon Linux 2/2023 (用户名: `ec2-user`)
   - [ ] Ubuntu (用户名: `ubuntu`)
   - [ ] 其他: `___________________`

我将帮你完成最终的 SSH 配置！

---

**密钥文件已准备就绪！** 🎉

