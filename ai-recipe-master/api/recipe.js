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

메뉴명:
조리시간: 약 00분
난이도: 초급/중급/고급

필요 재료:

- 재료 1
- 재료 2
- 재료 3
- 재료 4

조리 순서:

1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계
4. 네 번째 단계
5. 다섯 번째 단계

요리 팁:

- 간단한 팁 1개

주의사항:

- 알레르기, 질환, 식이 제한이 있으면 반드시 본인 상황에 맞게 조정하세요.

규칙:
- 위 제목 순서를 바꾸지 마세요.
- 제목 뒤에는 반드시 줄바꿈을 넣으세요.
- 필요 재료는 반드시 '-' 목록으로 작성하세요.
- 조리 순서는 반드시 숫자 목록으로 작성하세요.
- 문장은 짧고 쉽게 작성하세요.
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
