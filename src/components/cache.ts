import * as fs from "fs/promises";

async function cache(url: string, _function: (url:string) => Promise<any>) : Promise<any>{
    const name = url
    .split("/")
    .join("")
    .split(".")
    .join("")
    .replace("https:", "")
    .replace("html", "");
  try {
    const read: any = await fs.readFile(`temp/${name}.json`);
    const data: any = await JSON.parse(read);
    return data
  } catch (error) {
    const data = await _function(url)
    await fs.writeFile(`temp/${name}.json`, JSON.stringify(data));
    return data
  }
}

export default cache;