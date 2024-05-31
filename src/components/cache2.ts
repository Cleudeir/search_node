import * as fs from "fs/promises";
import os from "os";

const dir = os.homedir() + "/temp/search";
console.log(`${dir}`);

async function cache2(
  name: string,
  params: any,
  _function: (params: any) => Promise<any>
): Promise<any> {
  console.log("name: ", name);
  try {
    const filePath = `${dir}/${name}.json`;
    const fileExists = await fs.access(filePath)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const read: any = await fs.readFile(filePath);
      const { data, timestamp }: any = JSON.parse(read);
      const currentTime = Date.now();
      const timeDiffInSeconds = (currentTime - timestamp) / 1000;

      // Check if data is not expired (e.g., less than 1 hour old)
      if (timeDiffInSeconds > 3600) {
        console.log(">>>>>>>>> data update in file <<<<<<<<<<<<<");
        _function(params).then(newData => {
          fs.writeFile(filePath, JSON.stringify({ data: newData, timestamp: Date.now() }));
        })
      }
      console.log(">>>>>>>>> data exists in file <<<<<<<<<<<<<");
      return data;
    }

    console.log(">>>>>>>>> data doesn't exist in file or is expired <<<<<<<<<<<<<");
    const newData = await _function(params);
    if (newData) {
      await fs.writeFile(filePath, JSON.stringify({ data: newData, timestamp: Date.now() }));
    }
    return newData;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

export default cache2;
