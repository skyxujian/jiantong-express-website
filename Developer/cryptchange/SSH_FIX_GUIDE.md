# 🔧 SSH 连接问题解决方案

## 📊 当前情况分析

### ✅ 正常工作的部分
- AWS EC2 Instance Connect (网页版) ✅ 可以登录
- 服务器运行正常 ✅
- SSH 服务运行正常 ✅

### ❌ 问题
- 本地 Mac SSH 连接失败
- 错误: `kex_exchange_identification: Connection closed`
- 连接在密钥交换阶段就被关闭

### 🎯 问题根源

这个错误通常是以下原因之一：
1. **IP 被限制** (TCP Wrappers, fail2ban)
2. **连接数限制** (MaxStartups)
3. **AWS 安全组规则问题**
4. **防火墙规则**

---

## 🚀 通过网页版修复（推荐步骤）

### 第 1 步：登录网页版终端

1. AWS 控制台 → EC2 → 实例
2. 选择你的实例 (13.212.91.57)
3. 点击 "连接"
4. 选择 "EC2 Instance Connect"
5. 点击 "连接"

### 第 2 步：在网页终端执行以下命令

#### 🔍 检查 1: 查看 SSH 日志（找出真正原因）

```bash
# 查看实时 SSH 日志
sudo tail -50 /var/log/auth.log

# 或者实时监控（在一个窗口保持运行）
sudo tail -f /var/log/auth.log
```

**然后在本地尝试连接**，观察日志输出。

#### 🔍 检查 2: 检查 TCP Wrappers

```bash
# 查看是否有 IP 限制
cat /etc/hosts.allow
cat /etc/hosts.deny

# 如果有限制，暂时允许所有 SSH 连接
echo "sshd: ALL" | sudo tee -a /etc/hosts.allow
```

#### 🔍 检查 3: 检查 fail2ban（可能封禁了你的 IP）

```bash
# 检查 fail2ban 是否安装
sudo systemctl status fail2ban

# 如果安装了，查看被封禁的 IP
sudo fail2ban-client status sshd

# 解除封禁（替换为你的 VPN IP）
sudo fail2ban-client set sshd unbanip 185.220.238.177
```

#### 🔍 检查 4: 检查 UFW 防火墙

```bash
# 查看防火墙状态
sudo ufw status

# 如果启用了，确保允许 SSH
sudo ufw allow 22/tcp
sudo ufw reload
```

#### 🔍 检查 5: SSH 配置优化

```bash
# 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 确保以下设置正确（找到对应行并修改）：
```

需要确认的配置：
```
Port 22
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding yes
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server

# 重要！增加这些配置
MaxStartups 10:30:60
MaxSessions 10
ClientAliveInterval 60
ClientAliveCountMax 3
```

保存后重启 SSH：
```bash
sudo systemctl restart sshd
```

#### 🔍 检查 6: 查看当前 SSH 连接

```bash
# 查看当前 SSH 连接数
sudo netstat -tnpa | grep ':22.*ESTABLISHED'

# 或
sudo ss -tnp | grep ':22'
```

#### 🔍 检查 7: 检查 AWS 元数据

```bash
# 检查安全组
curl -s http://169.254.169.254/latest/meta-data/security-groups

# 检查实例 ID
curl -s http://169.254.169.254/latest/meta-data/instance-id
```

---

## 🎯 最可能的解决方案

### 方案 1: 增加 MaxStartups（最常见！）

在网页终端执行：

```bash
# 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 找到或添加这一行：
MaxStartups 10:30:60

# 保存并退出（Ctrl+X, Y, Enter）

# 重启 SSH
sudo systemctl restart sshd

# 验证配置
sudo sshd -T | grep maxstartups
```

### 方案 2: 允许你的 IP

```bash
# 方法 A: TCP Wrappers
echo "sshd: 185.220.238.177" | sudo tee -a /etc/hosts.allow

# 方法 B: UFW 防火墙
sudo ufw allow from 185.220.238.177 to any port 22
```

### 方案 3: 临时禁用 fail2ban（如果安装了）

```bash
# 停止 fail2ban
sudo systemctl stop fail2ban

# 然后从本地尝试连接
# 如果成功，说明是 fail2ban 的问题
```

---

## 📝 完整诊断脚本（在网页终端运行）

复制以下脚本到网页终端：

```bash
#!/bin/bash

echo "🔍 SSH 连接问题诊断"
echo "===================="

# 1. SSH 服务状态
echo -e "\n1️⃣ SSH 服务状态:"
sudo systemctl status sshd | grep -E "Active|Loaded"

# 2. SSH 配置关键项
echo -e "\n2️⃣ SSH 配置:"
sudo sshd -T | grep -E "port|pubkey|password|maxstartups|maxsessions"

# 3. 防火墙状态
echo -e "\n3️⃣ 防火墙状态:"
sudo ufw status 2>/dev/null || echo "UFW 未安装"

# 4. TCP Wrappers
echo -e "\n4️⃣ TCP Wrappers:"
echo "hosts.allow:"
cat /etc/hosts.allow 2>/dev/null | grep -v "^#" | grep -v "^$"
echo "hosts.deny:"
cat /etc/hosts.deny 2>/dev/null | grep -v "^#" | grep -v "^$"

# 5. fail2ban
echo -e "\n5️⃣ fail2ban:"
sudo systemctl status fail2ban 2>/dev/null | grep Active || echo "fail2ban 未安装"

# 6. 当前 SSH 连接
echo -e "\n6️⃣ 当前 SSH 连接:"
sudo ss -tnp | grep ':22' | wc -l
echo "个连接"

# 7. 最近的 SSH 日志
echo -e "\n7️⃣ 最近的 SSH 错误日志:"
sudo grep -i "error\|fail\|refused" /var/log/auth.log | tail -10

echo -e "\n===================="
echo "✅ 诊断完成"
```

---

## 🔄 修复步骤（按顺序执行）

### 在网页终端执行：

```bash
# 1. 备份当前配置
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 2. 修改 SSH 配置
sudo sed -i 's/#MaxStartups 10:30:60/MaxStartups 10:30:60/' /etc/ssh/sshd_config
echo "MaxStartups 10:30:60" | sudo tee -a /etc/ssh/sshd_config

# 3. 允许所有 IP（临时测试）
echo "sshd: ALL" | sudo tee /etc/hosts.allow

# 4. 重启 SSH
sudo systemctl restart sshd

# 5. 验证
sudo systemctl status sshd
```

### 在本地 Mac 测试：

```bash
# 等待 10 秒后测试
ssh -v aws-cryptchange 2>&1 | grep -E "Connected|Authenticated|error"
```

---

## 🎯 如果还是不行

### 临时解决方案：使用密码登录

在网页终端执行：

```bash
# 1. 设置 ubuntu 用户密码
sudo passwd ubuntu
# 输入新密码（两次）

# 2. 启用密码登录
sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 3. 重启 SSH
sudo systemctl restart sshd
```

然后从本地连接（会提示输入密码）：
```bash
ssh ubuntu@13.212.91.57
```

---

## 📊 下一步

1. **在网页终端运行诊断脚本**
2. **执行修复步骤**
3. **从本地测试连接**
4. **查看实时日志找出问题**

把诊断结果和日志发给我，我会帮你精确定位问题！

---

## 🔗 快速命令参考

```bash
# 查看实时 SSH 日志
sudo tail -f /var/log/auth.log

# 重启 SSH
sudo systemctl restart sshd

# 检查 SSH 配置
sudo sshd -T | grep -i max

# 允许所有 SSH 连接
echo "sshd: ALL" | sudo tee /etc/hosts.allow

# 查看当前连接
sudo ss -tnp | grep ':22'
```

