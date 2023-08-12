"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const EncodeMessage_1 = require("./EncodeMessage");
const ENUM = __importStar(require("./utils/enum"));
const headers = new Map();
headers.set("Content-Type", "application/json");
headers.set("Authorization", "12345");
const payload = "Since candidate";
//In accordance with the "Since candidate"
const dummyResult = [
    2, 12, 0, 67, 111, 110, 116, 101, 110, 116, 45, 84, 121, 112, 101, 16, 0, 97,
    112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 106, 115, 111, 110, 13, 0,
    65, 117, 116, 104, 111, 114, 105, 122, 97, 116, 105, 111, 110, 5, 0, 49, 50,
    51, 52, 53, 15, 0, 0, 0, 83, 105, 110, 99, 101, 32, 99, 97, 110, 100, 105,
    100, 97, 116, 101,
];
describe("EncodeMessage", () => {
    it("encodes a message and give correct result", () => {
        const encodedMessage = EncodeMessage_1.BinaryMessageEncoder.encodeMessage(headers, payload);
        expect(Array.from(encodedMessage)).toEqual(dummyResult);
    });
    it("give exceeded header amount error", () => {
        const exceededHeaders = new Map();
        for (let i = 0; i < ENUM.MAX_HEADER_COUNT + 1; i++) {
            exceededHeaders.set(`Header${i}`, `Value${i}`);
        }
        expect(() => {
            EncodeMessage_1.BinaryMessageEncoder.encodeMessage(exceededHeaders, payload);
        }).toThrowError(ENUM.MESSAGE_HEADER_AMOUNT);
    });
    it("give header size error", () => {
        const exceededHeaders = new Map();
        exceededHeaders.set('x'.repeat(ENUM.MAX_HEADER_SIZE + 1), 'Some values');
        expect(() => {
            EncodeMessage_1.BinaryMessageEncoder.encodeMessage(exceededHeaders, payload);
        }).toThrowError(ENUM.MESSAGE_HEADER_SIZE);
    });
    it("give value size error", () => {
        const exceededValue = new Map();
        exceededValue.set('Header', 'x'.repeat(ENUM.MAX_HEADER_SIZE + 1));
        expect(() => {
            EncodeMessage_1.BinaryMessageEncoder.encodeMessage(exceededValue, payload);
        }).toThrowError(ENUM.MESSAGE_HEADER_SIZE);
    });
    it("give payload size error", () => {
        const exceededPayload = 'x'.repeat(ENUM.MAX_PAYLOAD_SIZE + 1);
        expect(() => {
            EncodeMessage_1.BinaryMessageEncoder.encodeMessage(headers, exceededPayload);
        }).toThrowError(ENUM.MESSAGE_PAYLOAD_SIZE);
    });
});
