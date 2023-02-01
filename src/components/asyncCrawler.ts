import { JSDOM } from "jsdom";
import cloudscraper from 'cloudscraper';

const getWebsiteContent = async (url: string): Promise<string | undefined> => {
  try {
    const content = await cloudscraper({
      uri: url,
      headers: {
        // User agent, Cache Control and Accept headers are required
        // User agent is populated by a random UA.
        'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
        'Cache-Control': 'private',
        'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
      },
      // Cloudscraper automatically parses out timeout required by Cloudflare.
      // Override cloudflareTimeout to adjust it.
      cloudflareTimeout: 5000,
      // Reduce Cloudflare's timeout to cloudflareMaxTimeout if it is excessive
      cloudflareMaxTimeout: 30000,
      // followAllRedirects - follow non-GET HTTP 3xx responses as redirects
      followAllRedirects: true,
      // Support only this max challenges in row. If CF returns more, throw an error
      challengesToSolve: 3,
      // Remove Cloudflare's email protection, replace encoded email with decoded versions
      decodeEmails: false,
      // Support gzip encoded responses (Should be enabled unless using custom headers)
      gzip: true,
    });
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
