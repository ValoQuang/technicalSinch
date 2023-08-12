"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_PAYLOAD_SIZE = exports.MESSAGE_HEADER_SIZE = exports.MESSAGE_HEADER_AMOUNT = exports.MAX_PAYLOAD_SIZE = exports.MAX_HEADER_SIZE = exports.MAX_HEADER_COUNT = void 0;
exports.MAX_HEADER_COUNT = 63;
exports.MAX_HEADER_SIZE = 1023;
exports.MAX_PAYLOAD_SIZE = 256 * 1024; // 256 KiB
exports.MESSAGE_HEADER_AMOUNT = "A message can only have a maximum of 63 headers.";
exports.MESSAGE_HEADER_SIZE = "Header names and values must be limited to 1023 bytes each.";
exports.MESSAGE_PAYLOAD_SIZE = "Payload size exceeds the limit of 256 KiB.";
