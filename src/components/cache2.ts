import * as fs from "fs/promises";
import os from 'os';
const dir = os.homedir() +'/temp/search'
async function cache2(name: string, params: any, _function: (params: any) => Promise<any>): Promise<any> {
  const timeNow = Date.now()
  console.log('name: ', name);
  try {
    const read: any = await fs.readFile(`${dir}/${name}.json`);    
    let { data, time }: any = await JSON.parse(read);
    if (!data || data.length === 0 || !time) {
      console.log('>>>>>>>>> data dont exists <<<<<<<<<<<<<');
      data = await _function(params)
      if (data) {
        void fs.writeFile(`${dir}/${name}.json`, JSON.stringify({ data, time: timeNow }));       
      }
    }
    if ((Number(timeNow) - Number(time)) > 24 * 60 * 60 * 1000) {
      console.log('>>>>>>>>> update data <<<<<<<<<<<<<');
      void _function(params).then(_data => {        
        if (_data) {
          void fs.writeFile(`${dir}/${name}.json`, JSON.stringify({ data: _data, time: timeNow }));         
        }
      })
    }
    return data
  } catch (error) {
    console.log('>>>>>>>>> data dont exists <<<<<<<<<<<<<');
    const data = await _function(params)
    void fs.writeFile(`${dir}/${name}.json`, JSON.stringify({ data, time: timeNow }))
    return data
  }
}

export default cache2;