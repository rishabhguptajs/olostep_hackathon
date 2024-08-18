import axios from 'axios';
import * as cheerio from 'cheerio';

interface NewsData {
  headline: string;
  summary: string;
}

export const scrapeNewsData = async (url: string): Promise<{ url: string, news: NewsData[] }> => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const news: NewsData[] = [];

    const headlineSelectors = ['h1', 'h2', 'h3', '.container__headline-text'];
    const summarySelectors = ['p', '.summary-text'];

    headlineSelectors.forEach((selector) => {
      $(selector).each((i, elem) => {
        const headline = $(elem).text().trim();

        let summary = '';
        for (const summarySelector of summarySelectors) {
          summary = $(elem).siblings(summarySelector).first().text().trim();
          if (summary) break;
        }

        if (headline) {
          news.push({ headline, summary });
        }
      });
    });

    return { url, news };
  } catch (error: any) {
    console.error(`Error scraping ${url}:`, error.message);
    throw error;
  }
};
