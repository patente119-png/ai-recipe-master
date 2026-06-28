export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 가능합니다." });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "읽을 텍스트가 없습니다." });
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
body: JSON.stringify({
  model: "gpt-4o-mini-tts",
  voice: "shimmer",
  input: text,
  instructions: "맑고 부드러운 여성 목소리로 자연스럽게 읽어주세요. 말은 천천히 또박또박 하고, 친절한 요리 선생님처럼 따뜻하고 편안하게 설명해주세요. 중요한 재료와 조리 순서는 조금 더 또렷하게 강조해서 읽어주세요."
})
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
