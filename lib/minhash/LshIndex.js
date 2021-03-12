"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultConfig = {
    bandSize: 4
};
class LshIndex {
    constructor(config) {
        this.config = { ...defaultConfig, ...config };
        this.index = {};
    }
    insert(key, minHash) {
        const hashBands = this.getHashBands(minHash);
        for (const band of hashBands) {
            if (Array.isArray(this.index[band])) {
                this.index[band].push(key);
            }
            else {
                this.index[band] = [key];
            }
        }
    }
    query(minHash) {
        const matches = [];
        const hashBands = this.getHashBands(minHash);
        for (let i = 0; i < hashBands.length; i++) {
            const band = hashBands[i];
            for (let j = 0; j < this.index[band].length; j++) {
                matches.push(this.index[band][j]);
            }
        }
        return matches;
    }
    getHashBands(minHash) {
        if (minHash.hashBands) {
            return minHash.hashBands;
        }
        minHash.hashBands = [];
        for (let i = 0; i < minHash.hashValues.length; i++) {
            const start = i * this.config.bandSize;
            const end = start + this.config.bandSize;
            const band = minHash.hashValues.slice(start, end);
            minHash.hashBands.push(band.join('.'));
        }
        return minHash.hashBands;
    }
}
exports.default = LshIndex;
