import { JSDOM } from "jsdom";
import fetch from "node-fetch";

const getWebsiteContent = async (url: string): Promise<string | undefined> => {
  try {
    const option = {
      headers: {
        "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        "Accept-Language": 'en',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
      }
    }
    const content = await fetch(url, option);

    console.log('url: ', url);
    console.log('content: ', content);
    const text = await content.text();
    return text;
  } catch (error) {
    console.log(error);
  }
};

const asyncCrawlerSingle = async function (url: string): Promise<any> {
  try {
    const websiteHtml = await getWebsiteContent(url);
    const dom: JSDOM = new JSDOM(websiteHtml);
    const doc = dom.window.document;
    return doc;
  } catch (error) {
    console.log(error);
  }
};

export default asyncCrawlerSingle;
