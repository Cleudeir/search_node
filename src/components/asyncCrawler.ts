import { JSDOM } from "jsdom";
import cloudscraper from 'cloudscraper';

const getWebsiteContent = async (url: string): Promise<string | undefined> => {
  try {
    const content = await cloudscraper.get(url);
    console.log('url: ', url);
    console.log('content: ', content);
    // const text = await content.text();
    return content;
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
