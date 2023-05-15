import * as fs from "fs/promises";

async function cache(url: string, _function: (url: string) => Promise<any>): Promise<any> {
  const timeNow = Date.now()
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
    .join("")
  try {
    const read: any = await fs.readFile(`temp/${name}.json`);
    console.log('name: ', name);
    let { data, time }: any = await JSON.parse(read);
    if (!data || data.length === 0 || !time) {
      data = await _function(url)
      console.log('>>>>>>>>>: data search', data.length);
      if (data) {
        void fs.writeFile(`temp/${name}.json`, JSON.stringify({ data, time: timeNow }));       
      }
    }
    if ((Number(timeNow) - Number(time)) > 24 * 60 * 60 * 1000) {
      void _function(url).then(_data => {
        console.log('>>>>>>>>>: _data search', _data.length);
        if (_data) {
          void fs.writeFile(`temp/${name}.json`, JSON.stringify({ data: _data, time: timeNow }));         
        }
      })

    }
    return data
  } catch (error) {
    const data = await _function(url)
    void fs.writeFile(`temp/${name}.json`, JSON.stringify({ data, time: timeNow }))
    return data
  }
}

export default cache;