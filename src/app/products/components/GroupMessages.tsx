"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  createdAt: Date;
};

type GroupMessagesProps = {
  messages: Message[];
  allMessages?: Message[];
};

export default function GroupMessages({ messages, allMessages = messages }: GroupMessagesProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleShowAll = () => {
    if (isMobile) {
      router.push(`/messages/${messages[0].productId}`);
    } else {
      setShowAllMessages(true);
    }
  };

  const MessageList = ({ messages }: { messages: Message[] }) => (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-white rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">{formatDate(message.createdAt)}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
              >
                {expandedId === message.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedId === message.id ? "max-h-none" : "max-h-24"
              }`}
            >
              <p className="text-gray-700 whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">近期群消息</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShowAll}
          className="text-blue-600 hover:text-blue-800"
        >
          查看更多
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <MessageList messages={messages.slice(0, 3)} />

      {!isMobile && (
        <Modal
          isOpen={showAllMessages}
          onClose={() => setShowAllMessages(false)}
          title="群消息历史"
        >
          <MessageList messages={allMessages} />
        </Modal>
      )}
    </div>
  );
}
