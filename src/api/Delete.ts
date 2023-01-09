import * as fs from "fs/promises";
import { DataMovie, DataTv } from "../components/interfaces";

class Delete {
    name: string
    data: string[] | []
    static insert: any;

    public constructor(_name: string) {
        this.name = _name
        this.data = []
        this.start()
    }
    public async start(): Promise<void> {
        try {
            const read = await fs.readFile(`temp/${this.name}.json`)
            const data = await JSON.parse(String(read))
            this.data = data
        } catch (error) {
            console.log(error)
            this.data = []
        }
    }

    public async read(): Promise<string[] | []> {
        return this.data
    }

    public async insert(item: DataMovie | DataTv): Promise<string[] | null> {
        try {
            const data = [item.title, ...this.data]
            await fs.writeFile(`temp/${this.name}.json`, JSON.stringify(data))
            this.data = data
            return data
        } catch (error) {
            console.log(error)
            return this.data
        }
    }
}

export default Delete