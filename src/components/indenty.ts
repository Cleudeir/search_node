import { promises as fs } from 'fs';

interface IHttpRequest {
  connection: {
    remoteAddress: string;
  };
  headers: Record<string, string>;
}

interface IClientInfo {
  ipAddress: string;
  language: string;
  userAgent: string;
}

const CLIENT_FOLDER_PATH = 'clients';

async function identifyRequestClient(request: IHttpRequest): Promise<IClientInfo> {
  const clientInfo: IClientInfo = {
      ipAddress: '',
      language: '',
      userAgent: ''
  };
  const ipAddress = request.connection.remoteAddress.replace('::ffff:','').split('.').join('_')
  clientInfo.ipAddress = ipAddress;
  console.log('request.connection.remoteAddress: ', ipAddress);
  clientInfo.language = request.headers["accept-language"];
  clientInfo.userAgent = request.headers["user-agent"];

  try {
    await fs.access(CLIENT_FOLDER_PATH);
  } catch (error) {
    await fs.mkdir(CLIENT_FOLDER_PATH);
  }

 await fs.writeFile(`${CLIENT_FOLDER_PATH}/${clientInfo.ipAddress}.json`, JSON.stringify(clientInfo));

  console.log("\x1b[32m", `Client information saved: ${JSON.stringify(clientInfo)}`);

  return clientInfo;
}
export default identifyRequestClient