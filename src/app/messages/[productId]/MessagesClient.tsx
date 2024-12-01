"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import { Share, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateQRCode } from "@/lib/qrcode";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Product, Platform } from "@prisma/client";

type Message = {
  id: string;
  content: string;
  createdAt: Date;
};

type ProductWithRelations = Product & {
  platform: Platform;
  messages: Message[];
};

type MessagesClientProps = {
  product: ProductWithRelations;
};

export default function MessagesClient({ product }: MessagesClientProps) {
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleShareMessage = async (messageId: string) => {
    try {
      const message = product.messages.find((m) => m.id === messageId);
      if (!message) return;

      // 创建临时的导出容器
      const tempDiv = document.createElement("div");
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        background-color: white;
        padding: 24px;
        border-radius: 12px;
        width: 800px;
        font-family: system-ui, -apple-system, sans-serif;
        opacity: 1;
        pointer-events: all;
      `;
      document.body.appendChild(tempDiv);

      // 渲染消息内容
      const messageDiv = document.createElement("div");
      messageDiv.style.cssText = `
        background-color: rgb(249 250 251);
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 20px;
      `;

      const timeDiv = document.createElement("div");
      timeDiv.style.cssText = `
        color: rgb(107 114 128);
        font-size: 14px;
        margin-bottom: 8px;
      `;
      timeDiv.textContent = formatDate(message.createdAt);
      messageDiv.appendChild(timeDiv);

      const contentDiv = document.createElement("div");
      contentDiv.style.cssText = `
        color: rgb(55 65 81);
        white-space: pre-line;
        font-size: 16px;
        line-height: 1.5;
      `;
      contentDiv.textContent = message.content;
      messageDiv.appendChild(contentDiv);

      tempDiv.appendChild(messageDiv);

      // 生成二维码
      const pageUrl = window.location.href;
      const qrCodeDataUrl = await generateQRCode(pageUrl);

      // 添加二维码
      const qrCodeImg = document.createElement("img");
      qrCodeImg.src = qrCodeDataUrl || "";
      qrCodeImg.style.cssText = `
        width: 120px;
        height: 120px;
        margin: 20px auto 0;
        display: block;
      `;
      tempDiv.appendChild(qrCodeImg);

      // 等待图片加载
      await new Promise((resolve) => {
        qrCodeImg.onload = resolve;
      });

      // 等待下一帧确保渲染完成
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // 生成图片
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        scale: 2,
      });

      // 清理临时元素
      document.body.removeChild(tempDiv);

      // 转换为图片并下载
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `群消息-${new Date().toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("消息已保存为图片");
    } catch (error) {
      console.error("导出失败:", error);
      toast.error("导出失败，请重试");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/products/${product.id}`} className="text-gray-500">
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-lg font-medium">群消息历史</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-[calc(4rem+theme(space.24))]">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {product.messages.map((message) => (
            <div
              key={message.id}
              ref={(el) => (messageRefs.current[message.id] = el)}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-500">{formatDate(message.createdAt)}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShareMessage(message.id)}
                  className="text-gray-400 hover:text-gray-600 -mt-1 -mr-2"
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{message.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/products/${product.id}`} className="block">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={product.imageUrl || "/default-product.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Image
                    src={product.platform.icon}
                    alt={product.platform.name}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span className="text-sm text-gray-500">{product.platform.name}</span>
                </div>
              </div>
            </div>
            <Button className="w-full">返回课程详情</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
