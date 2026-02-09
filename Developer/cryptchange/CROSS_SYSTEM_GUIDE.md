# 🖥️ 跨系统协同开发指南

> Windows 家里 + Mac 单位 同时开发，保持代码和进度一致

---

## 📋 核心原则

1. **Git 是唯一的真实来源** (Single Source of Truth)
2. **每天至少同步 2-3 次**
3. **分支策略清晰** (main/develop/feature)
4. **冲突尽早发现和处理**

---

## 🔄 Git 工作流程

### 推荐分支策略：Git Flow

```
main (生产)
 ↑
develop (开发主线)
 ├─ feature/auth (功能分支)
 ├─ feature/wallet (功能分支)
 └─ feature/trading (功能分支)
```

### 日常工作流 (重要！)

#### 🏠 在家 (Windows) - 开始工作

```bash
# 1. 切换到最新的代码
cd /path/to/cryptchange
git checkout develop
git pull origin develop    # 重要：先拉取最新代码

# 2. 创建功能分支（如果是新功能）
git checkout -b feature/user-auth

# 3. 编写代码并测试
# ... 编码工作 ...

# 4. 提交代码
git add .
git commit -m "feat: implement user authentication"

# 5. 推送到远程
git push origin feature/user-auth
```

#### 🏢 在单位 (Mac) - 继续工作

```bash
# 1. 确保在最新的代码上
cd /path/to/cryptchange
git fetch origin              # 获取最新远程信息
git checkout develop
git pull origin develop       # 拉取最新代码

# 2. 查看是否有新的分支
git branch -a

# 3. 切换到对应的分支
git checkout feature/user-auth
git pull origin feature/user-auth

# 4. 继续开发
# ... 编码工作 ...

# 5. 提交并推送
git add .
git commit -m "feat: add JWT token validation"
git push origin feature/user-auth
```

#### 📱 完成功能 - 合并请求

```bash
# 代码完成后：
git push origin feature/user-auth

# 然后在 GitHub 创建 Pull Request
# main 分支 <- feature/user-auth
# 添加描述、检查冲突
# 合并到 develop
```

---

## ⚠️ 避免冲突的方式

### ✅ 推荐做法

1. **经常 pull** - 每天开始工作时
   ```bash
   git pull origin develop
   ```

2. **小而频繁的提交** - 而不是大型提交
   ```bash
   # ✅ 好
   git commit -m "feat: add user login form"
   git commit -m "feat: add password validation"
   
   # ❌ 避免
   git commit -m "add entire authentication system"
   ```

3. **在本地解决冲突** - 而不是让它积累
   ```bash
   # 如果有冲突，立即解决
   git merge origin/develop
   # 手动编辑冲突文件
   git add .
   git commit -m "resolve: merge conflicts"
   git push
   ```

4. **不同的开发任务分工** - 减少文件冲突
   ```
   Windows (你):  后端 API 开发
   Mac (你):      前端 UI 开发
   
   这样两边改动的文件不同，冲突最少
   ```

### ❌ 要避免的做法

```bash
# ❌ 不要直接在 main 或 develop 上工作
git checkout develop
git commit -m "..."  # ← 避免这样

# ❌ 不要长时间不同步
git pull  # 不要忘记

# ❌ 不要强制推送（除非你明白后果）
git push -f origin   # ← 危险！

# ❌ 不要提交 node_modules、.env 等
# （应该在 .gitignore 中）
```

---

## 📝 环境一致性配置

### 1. Node.js 版本同步

**在 Windows 和 Mac 上都做**：

```bash
# 安装 nvm（版本管理器）
# Windows: https://github.com/coreybutler/nvm-windows
# Mac: brew install nvm

# 项目根目录创建 .nvmrc 文件
echo "18.16.0" > .nvmrc

# 两台机器都使用同一版本
nvm use
```

### 2. 依赖一致性

```bash
# 删除旧的 node_modules 和 lock 文件（只在第一次）
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 提交 lock 文件到 Git
git add package-lock.json
git commit -m "chore: update dependencies"
git push
```

### 3. .gitignore 配置

创建 `.gitignore` 文件（两边相同）：

```
# 依赖
node_modules/
package-lock.json

# 环境变量
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# 编译输出
dist/
build/
.next/

# 日志
*.log
npm-debug.log*
```

### 4. VS Code 设置同步

创建 `.vscode/settings.json` (提交到 Git)：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "python.linting.enabled": true,
  "prettier.semi": true,
  "prettier.singleQuote": true
}
```

---

## 🔍 每日同步检查清单

### 早上开始工作时 (无论 Windows 还是 Mac)

```bash
# 1. 检查 Git 状态
git status

# 2. 拉取最新代码
git fetch origin
git pull origin develop

# 3. 检查是否有新分支或更新
git branch -a

# 4. 查看最近的提交
git log --oneline -10

# 5. 如果有更新的依赖，安装
npm install
```

### 中午/下午时间点

```bash
# 提交和推送今天的工作
git add .
git commit -m "进度描述"
git push origin feature/xxx
```

### 下班前

```bash
# 最后一次推送
git push
git status  # 确保没有未提交的更改

# 在对话日志中记录进度
# 编辑 CONVERSATION_LOG.md
```

---

## 🚨 冲突解决步骤

### 如果遇到冲突

```bash
# 1. 尝试拉取
git pull origin develop
# 可能会看到: "CONFLICT (content merge)..."

# 2. 查看冲突文件
git status  # 看哪些文件有冲突

# 3. 打开冲突文件，看到类似的标记：
<<<<<<< HEAD
你在本地的代码
=======
远程的代码
>>>>>>> origin/develop

# 4. 手动编辑，保留需要的代码

# 5. 标记为已解决
git add .
git commit -m "resolve: merge conflict with origin/develop"
git push origin develop
```

---

## 📊 进度同步 (重要!)

### 使用 CONVERSATION_LOG.md

每次工作完成后，更新此文件：

```markdown
### 会话 #2 - 2026年2月10日

**地点**: Windows (家里) / Mac (单位)  
**时间**: 09:00 - 12:00

#### 完成的工作
- [x] 实现用户认证 API
- [x] 添加 JWT 验证

#### 推送的提交
- commit abc1234: feat: user authentication
- commit def5678: fix: JWT token validation

#### 待办事项
- [ ] 前端登录界面
- [ ] 2FA 验证

#### 冲突/问题
- 无
```

---

## 🎯 文件清单 (务必同步)

### 必须同步的文件

```
✅ CONVERSATION_LOG.md     - 进度日志
✅ package.json             - 依赖清单
✅ package-lock.json        - 依赖锁定
✅ .env.example             - 环境变量模板
✅ .nvmrc                   - Node 版本
✅ .gitignore               - Git 忽略规则
✅ .vscode/settings.json    - 编辑器配置
✅ 所有源代码 (.js, .ts)   - 核心代码
```

### 不要同步的文件

```
❌ node_modules/            - 自动生成
❌ .env                      - 个人密钥
❌ .vscode/extensions.json  - 本地扩展
❌ .DS_Store (Mac) / Thumbs.db (Win)
❌ dist/ build/             - 编译输出
```

---

## 🔗 GitHub 命令速查表

```bash
# 基础
git status                    # 查看状态
git log --oneline            # 查看提交历史
git diff                      # 查看本地更改

# 同步
git fetch origin              # 获取远程更新
git pull origin develop       # 拉取并合并
git push origin develop       # 推送代码

# 分支
git branch                    # 列出本地分支
git branch -a                 # 列出所有分支
git checkout -b feature/xxx   # 创建新分支
git checkout develop          # 切换分支
git branch -d feature/xxx     # 删除分支

# 冲突
git merge origin/develop      # 尝试合并
git status                    # 查看冲突
git add .                     # 标记解决
git commit -m "resolve: ..."  # 提交解决
```

---

## 📱 推荐工具

### Windows
- **Git**: https://git-scm.com/download/win
- **编辑器**: VS Code
- **终端**: Windows Terminal (推荐) 或 PowerShell
- **Git GUI**: SourceTree

### Mac
- **Git**: `brew install git`
- **编辑器**: VS Code
- **终端**: Zsh (已有)
- **Git GUI**: SourceTree 或 GitKraken

### 两边都安装
```bash
# 安装 Git 客户端
npm install -g git

# 安装编辑器扩展
# - Prettier (代码格式化)
# - ESLint (代码检查)
# - GitLens (Git 可视化)
```

---

## 🎓 常见场景

### 场景 1: Windows 写了代码，回到 Mac

```bash
# Mac 上
git pull origin develop
# 自动获取 Windows 推送的代码
# 继续开发
```

### 场景 2: 两边同时改了同一个文件

```bash
# Windows 先推送了
git push origin feature/auth

# Mac 也想推送同一个文件
git push origin feature/auth
# 可能被拒绝

# 解决方式：
git pull origin feature/auth
# 编辑冲突
git add .
git commit -m "resolve: merge conflict"
git push origin feature/auth
```

### 场景 3: 忘记 pull 直接 commit

```bash
# Windows
git commit -m "add feature"
git push
# 失败：远程有新代码

# 解决：
git pull origin develop
git push origin develop
```

---

## ✅ 每日启动清单

| 任务 | Windows | Mac |
|------|---------|-----|
| 拉取最新代码 | `git pull` | `git pull` |
| 安装依赖 | `npm install` | `npm install` |
| 检查环境 | Node 版本 | Node 版本 |
| 查看进度日志 | CONVERSATION_LOG.md | CONVERSATION_LOG.md |
| 启动开发环境 | 查看项目文档 | 查看项目文档 |

---

**关键记住**: Git 是你的同步枢纽，频繁提交和推送是保持一致性的秘诀！🔄

