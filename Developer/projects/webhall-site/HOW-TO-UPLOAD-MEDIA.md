# 如何上传照片和视频到网站

## 📸 照片上传指南

### 方法一：直接复制文件（推荐）

1. **准备照片**
   - 在本地整理好你的旅行照片
   - 建议重命名为有意义的文件名，例如：`yunnan-lijiang-1.jpg`

2. **复制到对应目录**
   ```bash
   # 国内旅行照片
   cp ~/Pictures/你的照片.jpg /Users/apple/Developer/projects/webhall-site/assets/img/travel/
   
   # 海外旅行照片
   cp ~/Pictures/你的照片.jpg /Users/apple/Developer/projects/webhall-site/assets/img/travel/overseas/
   ```

3. **在HTML中引用**
   ```html
   <!-- 国内旅行 -->
   <img src="/assets/img/travel/你的照片.jpg" alt="描述" loading="lazy">
   
   <!-- 海外旅行 -->
   <img src="/assets/img/travel/overseas/你的照片.jpg" alt="描述" loading="lazy">
   ```

### 方法二：使用Finder（图形界面）

1. 打开Finder，前往项目目录：
   - 按 `Cmd + Shift + G`
   - 输入：`/Users/apple/Developer/projects/webhall-site/assets/img/travel/`
   
2. 直接拖拽照片到该文件夹

3. 在HTML文件中引用照片路径

### 照片优化建议

**压缩照片以提高网站加载速度：**

使用在线工具：
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/

或使用命令行工具：
```bash
# 安装ImageMagick
brew install imagemagick

# 批量压缩图片（保持宽度1920px，质量85%）
for img in *.jpg; do
  convert "$img" -resize 1920x -quality 85 "compressed_$img"
done
```

**推荐尺寸：**
- 横幅图片：1200x400px
- 文章预览图：800x600px
- 照片画廊：600x400px
- 文章内大图：最大宽度1920px

---

## 🎥 视频上传指南

### 方法一：直接复制视频文件

1. **准备视频**
   - 确保视频格式为 MP4 (H.264编码)
   - 建议视频大小不超过50MB

2. **复制到对应目录**
   ```bash
   # 国内旅行视频
   cp ~/Movies/你的视频.mp4 /Users/apple/Developer/projects/webhall-site/assets/video/travel/
   
   # 海外旅行视频
   cp ~/Movies/你的视频.mp4 /Users/apple/Developer/projects/webhall-site/assets/video/travel/overseas/
   ```

3. **在HTML中引用**
   ```html
   <div class="travel-video">
     <video controls poster="/assets/img/travel/视频封面.jpg">
       <source src="/assets/video/travel/你的视频.mp4" type="video/mp4">
       您的浏览器不支持视频播放。
     </video>
     <p class="video-caption">视频描述</p>
   </div>
   ```

### 视频压缩（重要！）

如果视频文件太大，需要压缩：

**使用FFmpeg压缩（推荐）：**

```bash
# 安装FFmpeg
brew install ffmpeg

# 压缩视频（保持1080p，码率2Mbps）
ffmpeg -i input.mp4 \
  -vcodec h264 \
  -acodec aac \
  -b:v 2M \
  -b:a 128k \
  -vf scale=1920:-2 \
  output.mp4

# 压缩为720p（更小的文件）
ffmpeg -i input.mp4 \
  -vcodec h264 \
  -acodec aac \
  -b:v 1.5M \
  -b:a 128k \
  -vf scale=1280:-2 \
  output.mp4
```

**使用HandBrake（图形界面）：**
1. 下载：https://handbrake.fr/
2. 导入视频
3. 选择预设："Web" > "Gmail Large 3 Minutes 720p30"
4. 导出

### 方法二：使用云存储（推荐用于大视频）

如果视频太大，可以上传到云存储：

**YouTube：**
```html
<div class="travel-video">
  <iframe width="100%" height="450" 
    src="https://www.youtube.com/embed/你的视频ID" 
    frameborder="0" allowfullscreen>
  </iframe>
  <p class="video-caption">视频描述</p>
</div>
```

**阿里云OSS / 腾讯云COS：**
1. 上传视频到云存储
2. 获取CDN链接
3. 在HTML中引用CDN链接

---

## 📁 目录结构

```
webhall-site/
├── assets/
│   ├── img/
│   │   └── travel/
│   │       ├── *.jpg              # 国内旅行照片
│   │       └── overseas/
│   │           └── *.jpg          # 海外旅行照片
│   └── video/
│       └── travel/
│           ├── *.mp4              # 国内旅行视频
│           └── overseas/
│               └── *.mp4          # 海外旅行视频
└── travel/
    └── posts/
        ├── 2026-01-yunnan.html    # 国内游记
        └── 2025-09-japan.html     # 海外游记
```

---

## 🚀 完整工作流程示例

### 添加一篇新的旅行博客：

1. **准备素材**
   ```bash
   # 创建临时工作目录
   mkdir ~/Desktop/新旅行博客
   cd ~/Desktop/新旅行博客
   
   # 整理照片和视频
   # - 选出5-10张最好的照片
   # - 1-2个短视频（每个不超过1分钟）
   ```

2. **优化照片**
   ```bash
   # 压缩照片
   for img in *.jpg; do
     convert "$img" -resize 1920x -quality 85 "opt_$img"
   done
   ```

3. **压缩视频**
   ```bash
   # 压缩视频为720p
   ffmpeg -i video1.mov -vcodec h264 -b:v 1.5M -vf scale=1280:-2 video1.mp4
   ```

4. **复制到项目**
   ```bash
   # 复制照片
   cp opt_*.jpg /Users/apple/Developer/projects/webhall-site/assets/img/travel/overseas/
   
   # 复制视频
   cp *.mp4 /Users/apple/Developer/projects/webhall-site/assets/video/travel/overseas/
   ```

5. **创建博客文章**
   - 复制一个现有的HTML文件作为模板
   - 修改标题、内容
   - 更新照片和视频路径

6. **部署网站**
   ```bash
   cd /Users/apple/Developer/projects/webhall-site
   ./deploy.sh
   ```

---

## 💡 实用技巧

### 批量重命名照片
```bash
# 按顺序重命名
counter=1
for file in *.jpg; do
  mv "$file" "japan-$counter.jpg"
  ((counter++))
done
```

### 生成视频封面
```bash
# 从视频第5秒提取封面
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 cover.jpg
```

### 查看照片EXIF信息
```bash
# 安装exiftool
brew install exiftool

# 查看照片信息
exiftool photo.jpg
```

### 批量转换HEIC为JPG（iPhone照片）
```bash
# 安装ImageMagick
brew install imagemagick

# 批量转换
for img in *.HEIC; do
  convert "$img" "${img%.HEIC}.jpg"
done
```

---

## ⚠️ 注意事项

1. **版权**：确保照片和视频是你自己拍摄的，或有使用权限

2. **隐私**：注意不要上传包含敏感信息的照片

3. **文件命名**：
   - 使用英文和数字
   - 避免空格，使用连字符 `-`
   - 小写字母
   - 例如：`paris-eiffel-tower-1.jpg`

4. **文件大小**：
   - 单张照片：< 500KB
   - 单个视频：< 50MB
   - 如果超过，必须压缩

5. **备份**：在上传前保留原始文件备份

---

## 🔧 常用命令速查

```bash
# 查看文件大小
ls -lh *.jpg

# 批量查看图片尺寸
identify *.jpg

# 压缩整个目录的图片
find . -name "*.jpg" -exec convert {} -resize 1920x -quality 85 {} \;

# 查看视频信息
ffprobe video.mp4

# 提取视频音频
ffmpeg -i video.mp4 -vn -acodec copy audio.aac
```

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看项目的 README.md
2. 检查浏览器开发者工具的控制台错误
3. 确认文件路径是否正确

祝你上传顺利！🎉
