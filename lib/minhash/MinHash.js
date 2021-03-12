"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultConfig = {
    prime: 4294967311,
    maxHash: Math.pow(2, 32) - 1,
    numPerm: 128,
    seed: 1,
};
class MinHash {
    constructor(config) {
        this.config = { ...defaultConfig, ...config };
        this.hashValues = [];
        this.permA = [];
        this.permB = [];
        this.initHashValues();
        this.initPermutations();
    }
    initHashValues() {
        this.hashValues.fill(this.config.maxHash);
    }
    randInt() {
        const x = Math.sin(this.config.seed++) * this.config.maxHash;
        return Math.floor((x - Math.floor(x)) * this.config.maxHash);
    }
    initPermutations() {
        const used = this.initPerm(false);
        this.initPerm(true, used);
    }
    initPerm(whichPerm, used = {}) {
        const perms = [];
        for (let j = 0; j < this.config.numPerm; j++) {
            let rand = this.randInt();
            while (used[rand]) {
                rand = this.randInt();
            }
            perms.push(rand);
            used[rand] = true;
        }
        if (whichPerm) {
            this.permB = perms;
        }
        else {
            this.permA = perms;
        }
        return used;
    }
    update(word) {
        for (let i = 0; i < this.hashValues.length; i++) {
            const APerm = this.permA[i];
            const BPerm = this.permB[i];
            const hash = (APerm * this.hash(word) + BPerm) % this.config.prime;
            if (hash < this.hashValues[i]) {
                this.hashValues[i] = hash;
            }
        }
    }
    hash(str) {
        let hash = 0;
        if (!str.length) {
            return hash + this.config.maxHash;
        }
        for (const char of str) {
            const code = char.charCodeAt(0);
            hash = ((hash << 5) - hash) + code;
            hash &= hash;
        }
        return hash + this.config.maxHash;
    }
    jaccard(other) {
        if (this.hashValues.length != other.hashValues.length) {
            throw new Error('Cannot apply jaccard similarity to MinHashes with different count of hashValues');
        }
        if (this.config.seed != other.config.seed) {
            throw new Error('Cannot apply jaccard similarity to MinHashes with different seeds');
        }
        const shared = this.hashValues.reduce((acc, val, i) => {
            return val === other.hashValues[i] && ++acc;
        }, 0);
        return shared / this.hashValues.length;
    }
}
exports.default = MinHash;
