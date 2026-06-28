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
  voice: "echo",
  input: text,
  instructions: "귀엽고 상냥한 어린 여자아이처럼 자연스럽게 읽어주세요. 말은 천천히 또박또박, 밝고 따뜻한 목소리로 요리를 함께 만드는 친구처럼 설명해주세요."
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
