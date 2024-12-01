import prisma from "@/lib/prisma";
import PlatformForm from "./components/PlatformForm";
import { storage } from "@/lib/storage";

export default async function PlatformsPage() {
  const platforms = await prisma.platform.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">平台管理</h1>

      {/* 平台列表 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">现有平台</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <Image
                  src={platform.icon}
                  alt={platform.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="font-medium">{platform.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 添加新平台 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">添加新平台</h2>
        <PlatformForm />
      </div>
    </div>
  );
}
