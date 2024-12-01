"use client";

import { Comment, User } from "@prisma/client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CommentWithUser = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    avatar: string | null;
  };
};

type Props = {
  comments: CommentWithUser[];
  courseId: string;
};

export default function CommentSection({ comments: initialComments, courseId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/auth");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, productId: courseId }),
      });

      if (!res.ok) throw new Error("提交失败");

      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setContent("");
    } catch (error) {
      console.error("提交评论失败:", error);
      alert("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">评论区</h2>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={session ? "写下你的评论..." : "登录后参与评论"}
          className="w-full px-4 py-3 border rounded-lg resize-none"
          rows={4}
          required
          disabled={!session || loading}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!session || loading}
            className={`px-4 py-2 rounded-lg text-white ${
              !session || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "提交中..." : "提交评论"}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="relative w-10 h-10">
                <Image
                  src={comment.user.avatar || "/default-avatar.png"}
                  alt={comment.user.name || "用户头像"}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
