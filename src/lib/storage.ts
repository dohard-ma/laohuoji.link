import fs from "fs/promises";
import path from "path";

export class FileStorage {
  private uploadDir: string;

  constructor() {
    // 在 public 目录下创建 uploads 文件夹
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: File, filename: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成文件路径
    const ext = path.extname(file.name);
    const filepath = path.join(this.uploadDir, `${filename}${ext}`);

    // 保存文件
    await fs.writeFile(filepath, buffer);

    // 返回可访问的 URL
    return `/uploads/${filename}${ext}`;
  }

  async deleteFile(url: string): Promise<void> {
    if (!url.startsWith("/uploads/")) return;

    const filename = path.basename(url);
    const filepath = path.join(this.uploadDir, filename);

    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error("删除文件失败:", error);
    }
  }
}

// 导出单例
export const storage = new FileStorage();
