export default function HomePage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">姜胡说 线上共创平台</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">平台介绍</h2>
          <p className="text-gray-600 mb-4">
            这是一个为姜胡说社群打造的线上共创平台，旨在促进成员之间的交流与合作。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">平台价值</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">知识共享</h3>
              <p className="text-gray-600">汇集社群成员的专业知识和经验，促进知识的传播与交流。</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">资源对接</h3>
              <p className="text-gray-600">帮助成员找到所需的资源和合作伙伴，实现共同成长。</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">主要功能</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>课程和产品展示</li>
            <li>社群成员背景墙</li>
            <li>共创活动管理</li>
            <li>资源共享中心</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
