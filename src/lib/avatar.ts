export function generateAvatar(name: string, size = 128): string {
  // 创建 Canvas
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not supported");

  // 随机背景色
  const colors = [
    "#F87171", // red-400
    "#60A5FA", // blue-400
    "#34D399", // green-400
    "#FBBF24", // yellow-400
    "#A78BFA", // purple-400
    "#F472B6", // pink-400
  ];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  // 绘制背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // 设置文字样式
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `${size / 2}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 获取缩写
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // 绘制文字
  ctx.fillText(initials, size / 2, size / 2);

  // 转换为 Blob URL
  return canvas.convertToBlob().then((blob) => URL.createObjectURL(blob));
}
