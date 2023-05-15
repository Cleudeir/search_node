import { JSDOM , VirtualConsole} from "jsdom";
import fetch from 'node-fetch';

const getWebsiteContent = async (url: string): Promise<string | undefined> => {
  try {
    console.log('asyncCrawlerSingle url: ', url);
    const content = await fetch(url)
    const text = await content.text();
    return text;
  } catch (error) {
    console.log(error);
  }
};

const asyncCrawlerSingle = async function (url: string): Promise<any> {
  try {
    const websiteHtml = await getWebsiteContent(url);
    const virtualConsole = new VirtualConsole();
    const dom: JSDOM = new JSDOM(websiteHtml,{virtualConsole});  
    const doc = dom.window.document;
    return doc;
  } catch (error) {
    console.log(error);
  }
};

export default asyncCrawlerSingle;
