import { Router, Request, Response } from 'express';
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


  } catch (error: any) {
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

export default router;
