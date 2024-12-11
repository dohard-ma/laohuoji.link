interface AnalyzeProfileParams {
  bio: string;
  specialties: string;
  needs: string;
}

interface TagSuggestion {
  tag: string;
  type: "specialty" | "need";
  confidence: number;
}

interface TagClassification {
  category: "skill" | "need";
  confidence: number;
}

export async function analyzeProfile(params: AnalyzeProfileParams) {
  // TODO: 接入实际的 AI 服务
  // 这里先返回模拟数据
  return {
    suggestions: [
      { tag: "产品经理", type: "specialty", confidence: 0.9 },
      { tag: "用户研究", type: "specialty", confidence: 0.8 },
      { tag: "数据分析", type: "specialty", confidence: 0.7 },
      { tag: "前端开发", type: "need", confidence: 0.85 },
      { tag: "设计思维", type: "need", confidence: 0.75 },
    ],
  };
}

export async function classifyTag(tagName: string): Promise<TagClassification> {
  // TODO: 接入实际的 AI 服务
  // 这里先用简单的规则模拟
  const skillKeywords = ["开发", "设计", "管理", "运营", "编程", "写作"];
  const isSkill = skillKeywords.some((keyword) => tagName.includes(keyword));

  return {
    category: isSkill ? "skill" : "need",
    confidence: 0.8,
  };
}
