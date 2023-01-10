import * as fs from "fs/promises";
import { DataMovie, DataTv } from "../components/interfaces";

class Delete {
    name: string
    data: string[] | []
    static insert: any;

    public constructor(_name: string) {
        this.name = _name
        this.data = []
        void this.start()
    }

    public async start(): Promise<void> {
        try {
            const read = await fs.readFile(`temp/${this.name}.json`)
            const data = await JSON.parse(String(read))
            this.data = data
        } catch (error) {
            this.data = []
        }
    }

    public async read(): Promise<string[] | []> {
        return this.data
    }

    public async insert(item: DataMovie | DataTv): Promise<string[] | null> {
        try {
            const uniqueItem = this.data.filter(x => x === item.title)
            if (uniqueItem.length === 0) {
                const data = [item.title, ...this.data]
                await fs.writeFile(`temp/${this.name}.json`, JSON.stringify(data))
                this.data = data
                return data
            }
            return this.data
        } catch (error) {
            return this.data
        }
    }
}

export default Delete