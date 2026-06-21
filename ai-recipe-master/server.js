require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/recipe', async (req, res) => {
  try {
    const { ingredients, cuisine, servings } = req.body;

    if (!ingredients || !String(ingredients).trim()) {
      return res.status(400).json({ error: '재료를 입력해 주세요.' });
    }

    const selectedCuisine = cuisine || '한식';
    const selectedServings = servings || '2인분';

    const prompt = `
당신은 한국 사용자를 위한 친절한 AI 요리사입니다.
사용자가 입력한 재료를 최대한 활용해서 ${selectedCuisine} 스타일의 집밥 레시피를 만들어 주세요.

조건:
- 요리 종류: ${selectedCuisine}
- 인원수: ${selectedServings}
- 보유 재료: ${ingredients}
- 한국어로 작성
- 초보자도 따라 할 수 있게 쉽게 설명
- 부족한 재료가 있으면 "추가하면 좋은 재료"로 분리
- 과장하지 말고 현실적인 조리법 제시

반드시 아래 형식으로 출력:
메뉴명:
요리분류:
조리시간:
난이도:
예상칼로리:
필요재료:
추가하면 좋은 재료:
조리순서:
1.
2.
3.
4.
5.
요리팁:
주의사항:
`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: '너는 실용적인 가정식 레시피를 만드는 전문 AI 요리사다.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1200,
    });

    const recipe = completion.choices?.[0]?.message?.content || '레시피를 생성하지 못했습니다.';
    res.json({ recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '레시피 생성 중 오류가 발생했습니다. API 키 또는 서버 설정을 확인해 주세요.' });
  }
});

app.listen(port, () => {
  console.log(`AI Recipe Master server running on port ${port}`);
});
