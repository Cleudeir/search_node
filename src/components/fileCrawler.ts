import { JSDOM } from "jsdom";
import * as fs from "fs/promises";
import { resolve } from "path";

const fileCrawler = async function (url: string): Promise<any> {
  try {
    const websiteHtml = await fs.readFile(resolve(url));
    const text = Buffer.from(websiteHtml).toString()
    const dom: JSDOM = new JSDOM(text);
    const doc = dom.window.document;
    return doc;
  } catch (error) {
    console.log(error);
  }
};

export default fileCrawler;
