#!/bin/bash

# AWS SSH 连接诊断脚本

echo "🔍 AWS SSH 连接诊断"
echo "===================="

# 1. 检查密钥文件
echo -e "\n1️⃣ 检查密钥文件..."
KEY_FILE="/Users/apple/Developer/cryptchange/awsexchange/my-key.pem"
if [ -f "$KEY_FILE" ]; then
    ls -la "$KEY_FILE"
    echo "✅ 密钥文件存在"
else
    echo "❌ 密钥文件不存在"
    exit 1
fi

# 2. 检查密钥权限
echo -e "\n2️⃣ 检查密钥权限..."
PERMS=$(stat -f %A "$KEY_FILE" 2>/dev/null || stat -c %a "$KEY_FILE" 2>/dev/null)
if [ "$PERMS" = "400" ] || [ "$PERMS" = "600" ]; then
    echo "✅ 权限正确: $PERMS"
else
    echo "⚠️ 权限不正确: $PERMS (应该是 400)"
    echo "修复中..."
    chmod 400 "$KEY_FILE"
    echo "✅ 已修复为 400"
fi

# 3. 测试网络连接
echo -e "\n3️⃣ 测试网络连接到 13.212.91.57:22..."
if nc -z -w5 13.212.91.57 22 2>/dev/null; then
    echo "✅ 可以访问服务器的 22 端口"
elif timeout 5 bash -c 'cat < /dev/null > /dev/tcp/13.212.91.57/22' 2>/dev/null; then
    echo "✅ 可以访问服务器的 22 端口"
else
    echo "❌ 无法访问服务器的 22 端口"
    echo "   可能原因:"
    echo "   - AWS 安全组未开放你的 IP"
    echo "   - 需要连接 VPN"
    echo "   - 服务器未运行"
fi

# 4. 检查本地 IP
echo -e "\n4️⃣ 你的公网 IP..."
MY_IP=$(curl -s --max-time 5 ifconfig.me || curl -s --max-time 5 icanhazip.com || echo "无法获取")
echo "IP: $MY_IP"
if [[ $MY_IP =~ ^(202|203|211|218|219|220|221|222|223) ]]; then
    echo "⚠️ 看起来是中国大陆 IP，可能需要 VPN"
elif [ "$MY_IP" = "无法获取" ]; then
    echo "⚠️ 无法获取 IP，可能网络有问题"
else
    echo "✅ 非中国大陆 IP"
fi

# 5. 尝试连接（不同用户名）
echo -e "\n5️⃣ 尝试连接不同用户..."

USERS=("ubuntu" "ec2-user" "admin" "centos")
SERVER="13.212.91.57"

for USER in "${USERS[@]}"; do
    echo -e "\n  测试用户: $USER"
    timeout 5 ssh -o BatchMode=yes \
                 -o ConnectTimeout=5 \
                 -o StrictHostKeyChecking=no \
                 -o UserKnownHostsFile=/dev/null \
                 -i "$KEY_FILE" \
                 "$USER@$SERVER" \
                 "echo '✅ 成功！用户名是: $USER' && uname -a" 2>&1 | head -5
    
    if [ $? -eq 0 ]; then
        echo "  ✅ $USER 用户可以连接！"
        echo "  正确的连接命令:"
        echo "  ssh -i $KEY_FILE $USER@$SERVER"
        break
    else
        echo "  ❌ $USER 用户无法连接"
    fi
done

echo -e "\n===================="
echo "🎯 诊断完成"
echo ""
echo "如果所有用户都无法连接，请检查:"
echo "1. AWS 安全组是否允许你的 IP ($MY_IP)"
echo "2. 是否需要连接 VPN"
echo "3. EC2 实例是否在运行"
echo ""
echo "详细排查指南: cat SSH_TROUBLESHOOTING.md"
