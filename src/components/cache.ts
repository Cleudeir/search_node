import * as fs from "fs/promises";

async function cache(url: string, _function: (url: string) => Promise<any>): Promise<any> {
  const name = url
    .split("/")
    .join("")
    .split(".")
    .join("")
    .replace("https:", "")
    .replace("html", "");
  try {
    const read: any = await fs.readFile(`temp/${name}.json`);
    let data: any = await JSON.parse(read);
    console.log('data: ', data);
    if (!data || data.length === 0) {
      data = await _function(url)
      if (data) {
        await fs.writeFile(`temp/${name}.json`, JSON.stringify(data));
        return data
      }
    }
    return data
  } catch (error) {
    const data = await _function(url)
    await fs.writeFile(`temp/${name}.json`, JSON.stringify(data))
    return data
  }
}

export default cache;