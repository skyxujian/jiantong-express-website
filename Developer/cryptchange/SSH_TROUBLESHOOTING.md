# 🔧 AWS SSH 连接故障排查

## ⚠️ 当前状态

- ✅ 密钥文件已配置: `/Users/apple/Developer/cryptchange/awsexchange/my-key.pem`
- ✅ 权限正确: `400`
- ✅ SSH 配置已添加
- ✅ 服务器 IP: `13.212.91.57`
- ❌ 连接被拒绝: `Connection closed by 13.212.91.57 port 22`

---

## 🔍 可能的原因

### 1. AWS 安全组未开放你的 IP（最常见！）

**检查步骤**：
1. 登录 AWS 控制台
2. EC2 → 实例 → 选择你的实例
3. 点击 "安全" 标签
4. 查看安全组的入站规则

**需要的规则**：
```
类型: SSH
协议: TCP
端口范围: 22
来源: 你的 IP 地址 或 0.0.0.0/0 (所有 IP，测试用)
```

**修复方法**：
1. 点击安全组 ID
2. 编辑入站规则 → 添加规则
3. 类型选择 SSH
4. 来源选择 "My IP" (自动填充你的 IP)
5. 保存规则

### 2. 需要连接 VPN

**问题**: 服务器在新加坡 (`13.212.91.57` 是新加坡区域)，可能被中国大陆网络限制

**解决**:
```bash
# 连接到日本或新加坡 VPN 节点
# 然后再尝试连接
ssh aws-cryptchange
```

### 3. 用户名错误

**尝试不同的用户名**:
```bash
# 尝试 1: ubuntu (Ubuntu 系统)
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ubuntu@13.212.91.57

# 尝试 2: ec2-user (Amazon Linux)
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ec2-user@13.212.91.57

# 尝试 3: admin (Debian)
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem admin@13.212.91.57

# 尝试 4: root (某些配置)
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem root@13.212.91.57
```

### 4. 密钥不匹配

**验证密钥**:
```bash
# 查看密钥指纹
ssh-keygen -l -f /Users/apple/Developer/cryptchange/awsexchange/my-key.pem

# 在 AWS 控制台验证:
# EC2 → Key Pairs → 查看密钥指纹是否匹配
```

### 5. 实例未运行

**检查实例状态**:
- AWS 控制台 → EC2 → 实例
- 确保实例状态是 "running" (运行中)
- 检查状态检查是否通过

---

## ✅ 解决步骤（优先顺序）

### 第 1 步：检查并修复 AWS 安全组 ⭐⭐⭐⭐⭐

1. 登录 https://console.aws.amazon.com/
2. 进入 EC2 Dashboard
3. 选择你的实例
4. 点击 "安全" → "安全组"
5. 编辑入站规则
6. 添加或修改 SSH 规则:
   ```
   类型: SSH
   端口: 22
   来源: My IP (或 0.0.0.0/0 用于测试)
   ```
7. 保存

### 第 2 步：连接 VPN ⭐⭐⭐⭐

```bash
# 确保连接到日本或新加坡 VPN
# 验证 VPN 连接:
curl ifconfig.me
# 应该显示非中国大陆的 IP
```

### 第 3 步：重试连接 ⭐⭐⭐⭐

```bash
# 方法 1: 使用配置别名
ssh aws-cryptchange

# 方法 2: 直接命令
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ubuntu@13.212.91.57
```

### 第 4 步：尝试不同用户名 ⭐⭐⭐

```bash
# Ubuntu
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ubuntu@13.212.91.57

# Amazon Linux
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ec2-user@13.212.91.57

# Debian
ssh -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem admin@13.212.91.57
```

### 第 5 步：查看详细错误 ⭐⭐

```bash
# 使用详细模式
ssh -vvv -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ubuntu@13.212.91.57

# 查看最后几行错误信息
```

---

## 🎯 快速诊断命令

```bash
#!/bin/bash

echo "🔍 AWS SSH 连接诊断"
echo "===================="

# 1. 检查密钥文件
echo -e "\n1️⃣ 检查密钥文件..."
if [ -f "/Users/apple/Developer/cryptchange/awsexchange/my-key.pem" ]; then
    ls -la /Users/apple/Developer/cryptchange/awsexchange/my-key.pem
    echo "✅ 密钥文件存在"
else
    echo "❌ 密钥文件不存在"
fi

# 2. 检查密钥权限
echo -e "\n2️⃣ 检查密钥权限..."
PERMS=$(stat -f %A /Users/apple/Developer/cryptchange/awsexchange/my-key.pem)
if [ "$PERMS" = "400" ] || [ "$PERMS" = "600" ]; then
    echo "✅ 权限正确: $PERMS"
else
    echo "⚠️ 权限可能不正确: $PERMS (应该是 400)"
fi

# 3. 测试网络连接
echo -e "\n3️⃣ 测试网络连接..."
if nc -z -w5 13.212.91.57 22 2>/dev/null; then
    echo "✅ 可以访问服务器的 22 端口"
else
    echo "❌ 无法访问服务器的 22 端口（可能需要 VPN 或修改安全组）"
fi

# 4. 检查本地 IP
echo -e "\n4️⃣ 你的公网 IP..."
MY_IP=$(curl -s ifconfig.me)
echo "IP: $MY_IP"
if [[ $MY_IP =~ ^(202|203|211|218|219|220|221|222|223) ]]; then
    echo "⚠️ 看起来是中国大陆 IP，可能需要 VPN"
else
    echo "✅ 非中国大陆 IP"
fi

# 5. 尝试连接
echo -e "\n5️⃣ 尝试连接..."
echo "尝试 ubuntu 用户..."
timeout 5 ssh -o BatchMode=yes -o ConnectTimeout=5 -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ubuntu@13.212.91.57 exit 2>&1 | head -5

echo -e "\n尝试 ec2-user 用户..."
timeout 5 ssh -o BatchMode=yes -o ConnectTimeout=5 -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ec2-user@13.212.91.57 exit 2>&1 | head -5

echo -e "\n===================="
echo "🎯 诊断完成"
```

保存为 `diagnose-ssh.sh` 并运行:
```bash
chmod +x diagnose-ssh.sh
./diagnose-ssh.sh
```

---

## 📱 从 AWS 控制台连接（备选方案）

如果 SSH 还是不行，可以使用 AWS 的 Session Manager:

1. 登录 AWS 控制台
2. 进入 EC2 → 实例
3. 选择你的实例
4. 点击 "连接" 按钮
5. 选择 "Session Manager" 标签
6. 点击 "连接"

这样可以直接在浏览器中访问服务器，不需要 SSH。

---

## ⚙️ 当前 SSH 配置

```bash
# ~/.ssh/config
Host aws-cryptchange
    HostName 13.212.91.57
    User ec2-user
    IdentityFile /Users/apple/Developer/cryptchange/awsexchange/my-key.pem
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

**使用方法**:
```bash
ssh aws-cryptchange
```

---

## 🆘 需要帮助？

### 检查清单

- [ ] AWS 安全组已开放端口 22
- [ ] 安全组允许你的 IP 或 0.0.0.0/0
- [ ] VPN 已连接（如果在中国大陆）
- [ ] EC2 实例状态是 "running"
- [ ] 密钥文件权限是 400
- [ ] 尝试了正确的用户名

### 提供更多信息

如果还是不行，请提供：

1. **AWS 控制台截图**:
   - EC2 实例详情
   - 安全组入站规则

2. **SSH 详细错误**:
```bash
ssh -vvv -i /Users/apple/Developer/cryptchange/awsexchange/my-key.pem ubuntu@13.212.91.57 2>&1 | tail -30
```

3. **实例信息**:
   - 操作系统类型 (Amazon Linux / Ubuntu / etc.)
   - AMI ID
   - 密钥对名称

我将根据这些信息帮你进一步诊断！

