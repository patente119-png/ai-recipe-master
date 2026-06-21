export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 가능합니다." });
  }

  try {
    const { ingredients, cuisine, servings } = req.body;

   const prompt = `
너는 한국어로 설명하는 친절한 AI 요리사입니다.

재료: ${ingredients}
요리 종류: ${cuisine}
인원수: ${servings}

반드시 아래 형식 그대로 작성하세요.

[메뉴]
메뉴명:
조리시간:
난이도:

[재료]
- 재료 1
- 재료 2
- 재료 3

[조리법]
1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계
4. 네 번째 단계
5. 다섯 번째 단계

[요리팁]
- 요리 팁 1개

규칙:
- 반드시 [메뉴], [재료], [조리법], [요리팁] 순서로 작성하세요.
- 재료는 '-' 목록으로 작성하세요.
- 조리법은 숫자 목록으로 작성하세요.
- 문장은 짧고 쉽게 작성하세요.
- 줄바꿈을 충분히 넣어 세로로 보기 좋게 작성하세요.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "너는 집밥 레시피를 잘 만드는 한국어 요리 전문가다." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "OpenAI API 오류" });
    }

    return res.status(200).json({
      recipe: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
