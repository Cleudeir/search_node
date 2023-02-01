import { JSDOM } from "jsdom";
import fetch from "node-fetch";

const getWebsiteContent = async (url: string): Promise<string | undefined> => {
  try {
    const option = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0",
        "Accept": "application/json"
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
