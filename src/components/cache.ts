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
  console.log('name: ', name);
  try {
    const read: any = await fs.readFile(`temp/${name}.json`);
    
    let { data, time }: any = await JSON.parse(read);
    if (!data || data.length === 0 || !time) {
      console.log('>>>>>>>>> data dont exists <<<<<<<<<<<<<');
      data = await _function(url)      
      if (data) {
        void fs.writeFile(`temp/${name}.json`, JSON.stringify({ data, time: timeNow }));       
      }
    }
    if ((Number(timeNow) - Number(time)) > 24 * 60 * 60 * 1000) {
      console.log('>>>>>>>>> update data <<<<<<<<<<<<<');
      void _function(url).then(_data => {        
        if (_data) {
          void fs.writeFile(`temp/${name}.json`, JSON.stringify({ data: _data, time: timeNow }));         
        }
      })

    }
    return data
  } catch (error) {
    console.log('>>>>>>>>> data dont exists <<<<<<<<<<<<<');
    const data = await _function(url)
    void fs.writeFile(`temp/${name}.json`, JSON.stringify({ data, time: timeNow }))
    return data
  }
}

export default cache;