import * as fs from "fs/promises";
import os from "os";
const dir = os.homedir() + "/temp/search";
async function cache2(
  name: string,
  params: any,
  _function: (params: any) => Promise<any>
): Promise<any> {
  console.log("name: ", name);
  try {
    const read: any = await fs.readFile(`${dir}/${name}.json`);
    let { data }: any = await JSON.parse(read);
    console.log("data: ", data);
    if (!data || data.length === 0) {
      console.log(">>>>>>>>> data dont exists <<<<<<<<<<<<<");
      data = await _function(params);
      if (data) {
        await fs.writeFile(`${dir}/${name}.json`, JSON.stringify({ data }));
      }
    }

    void _function(params).then(async (_data) => {
      if (_data) {
        console.log(">>>>>>>>> update data <<<<<<<<<<<<<");
        await fs.writeFile(
          `${dir}/${name}.json`,
          JSON.stringify({ data: _data })
        );
      }
    });

    return data;
  } catch (error) {
    console.log(">>>>>>>>> data dont exists <<<<<<<<<<<<<");
    const data = await _function(params);
    await fs.writeFile(`${dir}/${name}.json`, JSON.stringify({ data }));
    return data;
  }
}

export default cache2;
