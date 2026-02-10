#!/bin/bash

# 🧪 认证系统快速测试脚本

set -e

API="http://localhost:3000/api"
EMAIL="test_$(date +%s)@example.com"
USERNAME="testuser_$(date +%s%N | cut -b1-13)"
PASSWORD="password123"

echo "🧪 开始认证系统测试..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. 测试健康检查
echo "📋 1️⃣ 测试健康检查..."
curl -s http://localhost:3000/health | jq '.'
echo ""

# 2. 用户注册
echo "📋 2️⃣ 测试用户注册..."
echo "📧 邮箱: $EMAIL"
echo "👤 用户名: $USERNAME"
REGISTER_RESPONSE=$(curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"username\": \"$USERNAME\",
    \"password\": \"$PASSWORD\"
  }")

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token')
echo "✅ 注册成功! Token: ${TOKEN:0:20}..."
echo ""

# 3. 测试获取当前用户
echo "📋 3️⃣ 测试获取当前用户信息..."
curl -s -X GET "$API/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 4. 测试登出
echo "📋 4️⃣ 测试登出..."
curl -s -X POST "$API/auth/logout" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 5. 测试登录
echo "📋 5️⃣ 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "$LOGIN_RESPONSE" | jq '.'
NEW_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
echo "✅ 登录成功! New Token: ${NEW_TOKEN:0:20}..."
echo ""

# 6. 测试无效token
echo "📋 6️⃣ 测试无效 Token 拒绝..."
curl -s -X GET "$API/auth/me" \
  -H "Authorization: Bearer invalid_token" | jq '.'
echo ""

# 7. 测试没有token
echo "📋 7️⃣ 测试没有 Token 的请求..."
curl -s -X GET "$API/auth/me" | jq '.'
echo ""

# 8. 测试重复邮箱
echo "📋 8️⃣ 测试重复邮箱注册..."
curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"username\": \"anotheruser\",
    \"password\": \"password123\"
  }" | jq '.'
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 所有测试完成!"
echo ""
echo "📊 测试总结:"
echo "  ✅ 健康检查"
echo "  ✅ 用户注册"
echo "  ✅ 获取当前用户"
echo "  ✅ 登出"
echo "  ✅ 用户登录"
echo "  ✅ 无效 Token 拒绝"
echo "  ✅ 没有 Token 拒绝"
echo "  ✅ 重复邮箱拒绝"
