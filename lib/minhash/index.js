"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LshIndex_1 = __importDefault(require("./LshIndex"));
const MinHash_1 = __importDefault(require("./MinHash"));
exports.default = {
    LshIndex: LshIndex_1.default,
    MinHash: MinHash_1.default,
};
