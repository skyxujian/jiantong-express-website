# 🚀 跨系统开发快速卡片

> 打印或保存这个，在 Windows 和 Mac 上都能用

---

## ⚡ 每日开始工作（30秒）

### Windows 和 Mac 都要做

```bash
# 1. 进入项目目录
cd /path/to/cryptchange

# 2. 切换到开发分支
git checkout develop

# 3. 拉取最新代码（最关键！）
git pull origin develop

# 4. 安装依赖（如果有新的）
npm install

# 5. 启动开发
npm run dev
```

---

## 📝 每日提交（重要！）

### 工作完成后立即执行

```bash
# 1. 查看更改
git status

# 2. 添加所有更改
git add .

# 3. 提交（写清楚做了什么）
git commit -m "feat: 描述你做的功能"
# 或
git commit -m "fix: 描述你修复的问题"
# 或
git commit -m "docs: 更新文档"

# 4. 推送到远程（绝对不要忘记！）
git push origin develop
```

---

## 🎯 创建功能分支（新功能时）

```bash
# 1. 基于最新的 develop 创建分支
git checkout develop
git pull origin develop
git checkout -b feature/你的功能名

# 2. 编写代码并提交
git add .
git commit -m "feat: 功能描述"

# 3. 推送分支
git push origin feature/你的功能名

# 4. 在 GitHub 创建 Pull Request 合并到 develop
```

---

## 🔴 遇到冲突怎么办

```bash
# 1. 拉取时有冲突
git pull origin develop

# 2. 查看冲突文件
git status

# 3. 用编辑器打开冲突文件，手动合并

# 4. 标记为已解决
git add .
git commit -m "resolve: 冲突已解决"
git push origin develop
```

---

## 🔍 切换系统时（从 Windows 到 Mac，或反之）

```bash
# 1. 确保前一个系统的代码已推送
git push origin develop

# 2. 切换到新系统，进入项目
cd /path/to/cryptchange

# 3. 拉取最新代码
git pull origin develop

# 4. 继续工作
# ...
```

---

## 💾 更新进度日志

```bash
# 编辑此文件
nano /path/to/cryptchange/CONVERSATION_LOG.md

# 添加你今天做的工作，然后：
git add CONVERSATION_LOG.md
git commit -m "docs: update conversation log"
git push origin develop
```

---

## 🚨 紧急救助

### 不小心在 main 上工作了

```bash
git checkout -b feature/应该的分支名
git push origin feature/应该的分支名
# 然后在 GitHub 创建 PR，改回 develop
```

### 想撤销最后一个提交

```bash
git reset --soft HEAD~1
# 代码保留，提交撤销
# 重新编辑后提交
```

### 完全搞坏了本地代码

```bash
git reset --hard origin/develop
# 恢复到远程的最新版本
# 所有本地更改会丢失，谨慎使用！
```

---

## ✅ 一天流程示例

### 早上 (9:00)
```bash
git pull origin develop      # 拉取昨天的代码
npm install                  # 安装依赖
npm run dev                  # 启动开发
# 开始编码...
```

### 中午 (12:00)
```bash
git add .                    # 添加更改
git commit -m "feat: user auth"
git push origin develop      # 推送
# 去吃饭...
```

### 下午 (14:00)
```bash
git pull origin develop      # 拉取同事/另一系统的代码
npm install
# 继续编码...
```

### 下班 (18:00)
```bash
git add .
git commit -m "fix: email validation"
git push origin develop      # 最后一次推送
# 关机离开
```

---

## 🎨 分支命名规范

```bash
feature/xxx       # 新功能
  feature/user-auth
  feature/wallet-management

fix/xxx           # 修复 bug
  fix/login-error
  fix/balance-calculation

docs/xxx          # 文档更新
  docs/api-guide

refactor/xxx      # 代码重构
  refactor/order-engine
```

---

## 📊 提交消息规范

```bash
# ✅ 好的提交消息
git commit -m "feat: add user authentication endpoint"
git commit -m "fix: resolve JWT token expiration bug"
git commit -m "docs: update API documentation"

# ❌ 不好的提交消息
git commit -m "update"
git commit -m "fix stuff"
git commit -m "asdfghjkl"
```

---

## 🔗 有用的 Git 命令

```bash
git log --oneline -10         # 查看最近 10 个提交
git branch -a                 # 查看所有分支
git diff                      # 查看本地更改
git stash                     # 暂存本地更改
git stash pop                 # 恢复暂存的更改
git remote -v                 # 查看远程仓库
```

---

**记住：频繁 pull 和 push 是保持同步的秘诀！** 🔄

