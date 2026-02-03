# 资源使用说明

## 图片资源

本网站使用 **Unsplash** 提供的免费、无版权图片。所有图片均可用于商业用途。

### 物流流程图片
- **揽收打单**: https://images.unsplash.com/photo-1566073771259-6a8506099945
- **国内集中**: https://images.unsplash.com/photo-1553062407-98eeb64c6a62
- **国际运输**: https://images.unsplash.com/photo-1543269865-cbdf26861551
- **清关配送**: https://images.unsplash.com/photo-1586528116039-c48fb1f9e398

### 媒体库展示图片
- **包装与处理**: https://images.unsplash.com/photo-1578866078328-c2fb6e6fcfc1
- **国际航运**: https://images.unsplash.com/photo-1450611001656-5658c7fb052b
- **陆地运输**: https://images.unsplash.com/photo-1454165804606-c3d57bc86b40
- **仓储管理**: https://images.unsplash.com/photo-1517694712202-14dd9538aa97
- **末端配送**: https://images.unsplash.com/photo-1454496522488-7a8e488e8606
- **全球覆盖**: https://images.unsplash.com/photo-1516852514423-00a51cf6238f

### 视频缩略图
- **国际快递流程演示**: https://images.unsplash.com/photo-1552664730-d307ca884978
- **跨境物流解决方案**: https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d
- **海外仓配服务**: https://images.unsplash.com/photo-1504384308090-c894fdcc538d

---

## 视频资源

当前使用的是 YouTube 示例视频 ID：
- `dQw4w9WgXcQ` - 演示视频 1
- `jNQXAC9IVRw` - 演示视频 2  
- `9bZkp7q19f0` - 演示视频 3

### 后期替换说明
要替换为实际的公司视频，只需在 `index.html` 中修改：
```html
<div class="video-placeholder" onclick="playVideo('YOUR_VIDEO_ID')">
```

将 `YOUR_VIDEO_ID` 替换为实际的 YouTube 视频 ID。

---

## 许可说明

### Unsplash 图片
- **许可证**: Free (可用于商业用途)
- **无需属性标注** (但尊重摄影师是礼貌的做法)
- **限制**: 不得出售无修改的照片
- **官网**: https://unsplash.com

### YouTube 视频
- 当前使用的示例视频仅作演示用
- 后期应替换为公司自行创建或获得许可的视频

---

## 功能说明

### 统览模式
点击页面右上方的 **"统览"** 按钮可切换图片库的展示模式，展示所有内容的统一视图。

### 图片点击效果
- 单击图片可展开显示标题
- 再次点击收起
- 移动设备上自动适配

### 视频播放
- 点击任意视频卡片即可在弹窗中全屏播放
- 支持 YouTube 和其他视频平台

---

## 后期更新建议

1. **更换为真实图片**: 
   - 拍摄公司的真实物流场景
   - 或向专业摄影师购买相关图片
   - 替换 CSS 中的背景图片 URL

2. **上传公司视频**:
   - 上传到 YouTube 或 Bilibili
   - 获取视频 ID
   - 在 `index.html` 中更新视频 ID

3. **本地化资源** (可选):
   - 将图片下载到 `assets/img/` 目录
   - 更新 CSS 中的 URL 为本地路径
   - 这样可以减少外部依赖

---

## 联系方式
如有资源相关问题，请联系网站维护人员。
