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

아래 형식으로 레시피를 작성하세요.

메뉴명:
조리시간:
난이도:
필요 재료:
조리 순서:
요리 팁:
주의사항:
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
