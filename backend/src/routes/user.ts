import { Router, Request, Response } from 'express';
import axios from 'axios';
import User from '../models/User';
import { scrapeNewsData } from '../scraper';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = new User({ userId });
    await user.save();
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/scrape', async (req: Request, res: Response) => {
  const { url } = req.body;

  try {    
    const data = await scrapeNewsData(url);

    const analyzedNewsPromises = data.news.map(async (newsItem) => {
      const aiResponse = await analyzeWithAI(newsItem.headline, newsItem.summary, url);
      return { ...newsItem, analysis: aiResponse };
    });

    const analyzedNews = await Promise.all(analyzedNewsPromises);

    res.status(200).json({ url, news: analyzedNews });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to scrape or analyze data' });
  }
});

const analyzeWithAI = async (headline: string, summary: string, url: string): Promise<string> => {
  try {
    console.log(process.env.OPENROUTER_API_KEY);
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'qwen/qwen-2-7b-instruct:free',
        messages: [
          { role: 'user', content: `Analyze and categorize the following news: "${headline}". Summary: "${summary}". Give the categorization in this format : 

          {
            "category": "category_name",
            "sub_category": "sub_category_name"
          }
          ` }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': url,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    // console.error('Error analyzing with AI:', error);
    return error.message;
  }
};

export default router;
