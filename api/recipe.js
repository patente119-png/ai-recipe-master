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
- 반드시 각 항목은 줄바꿈해서 작성하세요.
- [메뉴], [재료], [조리법], [요리팁] 제목은 각각 한 줄 단독으로 작성하세요.
- 메뉴명, 조리시간, 난이도는 각각 다른 줄에 작성하세요.
- 재료는 한 줄에 하나씩 작성하세요.
- 조리법은 한 줄에 하나의 단계만 작성하세요.
- 절대 한 문단으로 이어 쓰지 마세요.
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
