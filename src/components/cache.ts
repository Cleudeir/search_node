import * as fs from "fs/promises";
import os from 'os';

const dir = os.homedir() +'/temp/search';

async function cache(
  url: string,
  _function: (url: string) => Promise<any>
): Promise<any> {
  const timeNow = Date.now();
  const name = url
    .replace('redecanais.la/', '')
    .replace("browse", "")
    .split("/")
    .join("")
    .split(".")
    .join("")
    .replace("https:", "")
    .replace("html", "")
    .replace("?", "")
    .replace("=", "")
    .replace("_", "")
    .split("-")
    .join("");
  
  console.log('name: ', name);
  
  try {
    const filePath = `${dir}/${name}.json`;
    const fileExists = await fs.access(filePath)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const read: any = await fs.readFile(filePath);    
      let { data, time }: any = await JSON.parse(read);
      if (!data || data.length === 0 || !time) {
        console.log('>>>>>>>>> data doesnt exists <<<<<<<<<<<<<');
        data = await _function(url)      
        if (data) {
          await fs.writeFile(filePath, JSON.stringify({ data, time: timeNow }));       
        }
      }
      if ((Number(timeNow) - Number(time)) > 24 * 60 * 60 * 1000) {
        console.log('>>>>>>>>> update data <<<<<<<<<<<<<');
        const newData = await _function(url);
        if (newData) {
          await fs.writeFile(filePath, JSON.stringify({ data: newData, time: timeNow }));         
        }
        return newData;
      }
      return data;
    } else {
      console.log('>>>>>>>>> data doesnt exists <<<<<<<<<<<<<');
      const data = await _function(url)
      await fs.writeFile(filePath, JSON.stringify({ data, time: timeNow }))
      return data;
    }
  } catch (error) {
    console.log('Error occurred:', error);
    throw error;
  }
}

export default cache;
