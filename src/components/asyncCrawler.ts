import { JSDOM } from "jsdom";
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const getWebsiteContent = async (url: string): Promise<string | undefined> => {
  try {
    const content = await fetch(url);
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
