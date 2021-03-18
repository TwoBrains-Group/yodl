import asyncRedis from 'async-redis'

export type ModelProps = {
    name: string
    items: Array<string>
}

export class Model {
    name: string
    client: any // FIXME

    constructor(props: ModelProps) {
        this.name = props.name

        this.init()
    }

    init(): void {
        this.client = asyncRedis.createClient()
        this.client.on('error', this._handleError)
    }

    _handleError(err: Error): void {
        console.log(`Error in model ${this.name}:`, err)
    }

    // KEYS //
    _keyLiked(id: string) {
        return `${this.name}:${id}:liked`
    }

    _keyDisliked(id: string) {
        return `${this.name}:${id}:disliked`
    }

    _keyItemLiked(itemId: string, item: string) {
        return `${item}:${itemId}:liked`
    }

    _keyItemDisliked(itemId: string, item: string) {
        return `${item}:${itemId}:disliked`
    }

    _keySimilarity(id: string) {
        return `${this.name}:${id}:similarity`
    }

    // Algorithms //
    async jaccard(id1: string, id2: string): Promise<number> {
        const commonLiked = await this.client.sinter(this._keyLiked(id1), this._keyLiked(id2))
        const commonDisliked = await this.client.sinter(this._keyDisliked(id1), this._keyDisliked(id2))
        const diff1 = await this.client.sinter(this._keyLiked(id1), this._keyDisliked(id2))
        const diff2 = await this.client.sinter(this._keyDisliked(id1), this._keyLiked(id2))

        const similarity = commonLiked.length + commonDisliked.length - diff1.length - diff2.length
        const sum = commonLiked.length + commonDisliked.length + diff1.length + diff2.length

        return similarity / sum
    }

    async updateSimilarity(id: string, item: string) {
        const fullRatesSet = await this.client.sunion(this._keyLiked(id), this._keyDisliked(id))
        const fullRatesKeys: Set<string> = new Set()

        for (const itemId of fullRatesSet) {
            fullRatesKeys.add(this._keyItemLiked(itemId, item))
            fullRatesKeys.add(this._keyItemDisliked(itemId, item))
        }

        const 
    }
}
