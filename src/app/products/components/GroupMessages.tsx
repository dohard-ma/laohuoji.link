"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/types/message";
import { formatDate } from "@/lib/utils";

interface Props {
  messages: Message[];
  allMessages?: Message[];
}

export default function GroupMessages({ messages, allMessages = [] }: Props) {
  const router = useRouter();
  const [showAllMessages, setShowAllMessages] = useState(false);

  const handleShowAll = () => {
    if (messages[0]?.productId) {
      router.push(`/messages/${messages[0].productId}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">动态</h3>
        {allMessages.length > messages.length && (
          <button onClick={handleShowAll} className="text-sm text-blue-500 hover:text-blue-600">
            查看全部
          </button>
        )}
      </div>

      <div className="space-y-2">
        {messages.map((message) => (
          <div key={message.id} className="text-sm text-gray-600">
            <div className="flex justify-between items-start">
              <p>{message.content}</p>
              <span className="text-xs text-gray-400 ml-2">{formatDate(message.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
