#!/bin/bash
# 🚀 一键启动开发环境脚本

echo "🚀 启动加密货币交易所开发环境..."
echo ""

# 检查依赖
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 创建两个终端标签/窗口来启动后端和前端
echo "📝 启动后端服务器..."
osascript << EOF
tell application "Terminal"
    create window with default settings
    do script "cd /Users/apple/Developer/cryptchange/exchange-backend && npm run dev" in window 1
end tell
EOF

sleep 2

echo "📝 启动前端开发服务器..."
osascript << EOF
tell application "Terminal"
    create window with default settings
    do script "cd /Users/apple/Developer/cryptchange/exchange-frontend && npm run dev" in window 1
end tell
EOF

echo ""
echo "✅ 开发环境已启动！"
echo ""
echo "🌐 前端: http://localhost:3001"
echo "🔌 后端: http://localhost:3000"
echo ""
echo "💡 提示:"
echo "  - 后端：src/routes/ 中编辑路由"
echo "  - 前端：src/pages/ 和 src/components/ 中编辑页面"
echo "  - 改动会自动热重载"
