"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useState, useEffect } from "react";

const REMINDER_KEY = "tagsReminderClosedSession";

export default function TagsReminder() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 使用 sessionStorage 而不是 localStorage
    const hasClosedReminder = sessionStorage.getItem(REMINDER_KEY);
    if (!hasClosedReminder) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    // 在当前会话中记住用户的选择
    sessionStorage.setItem(REMINDER_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg p-4 border border-yellow-200 animate-fade-in z-50">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-medium mb-1">完善你的标签</h3>
          <p className="text-sm text-gray-600 mb-3">
            添加技能和需求标签可以帮助你更好地匹配资源和伙伴
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                router.push("/register/complete");
                handleClose();
              }}
            >
              去完善
            </Button>
            <Button size="sm" variant="outline" onClick={handleClose}>
              暂不需要
            </Button>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-500"
          aria-label="关闭提醒"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
