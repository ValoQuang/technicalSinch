// Define the maximum limits
var MAX_HEADER_COUNT = 63;
var MAX_HEADER_SIZE = 1023;
var MAX_PAYLOAD_SIZE = 256 * 1024; // 256 KiB
var BinaryMessageEncoder = /** @class */ (function () {
    function BinaryMessageEncoder() {
    }
    // Helper function to concatenate Uint8Arrays
    BinaryMessageEncoder.concatUint8Arrays = function (arrays) {
        var totalLength = arrays.reduce(function (acc, arr) { return acc + arr.byteLength; }, 0);
        var result = new Uint8Array(totalLength);
        var offset = 0;
        for (var _i = 0, arrays_1 = arrays; _i < arrays_1.length; _i++) {
            var arr = arrays_1[_i];
            result.set(arr, offset);
            offset += arr.byteLength;
        }
        return result;
    };
    // Helper function to convert a string to an array of ASCII codes (bytes)
    BinaryMessageEncoder.stringToBytes = function (input) {
        var bytes = new Uint8Array(input.length);
        for (var i = 0; i < input.length; i++) {
            bytes[i] = input.charCodeAt(i) & 0xFF; // Keep only the lowest 8 bits (ASCII)
        }
        return bytes;
    };
    BinaryMessageEncoder.encodeMessage = function (headers, payload) {
        //Maximum headers 63
        var headerCount = Math.min(headers.size, MAX_HEADER_COUNT);
        if (headers.size > MAX_HEADER_COUNT) {
            throw new Error("A message can only have a maximum of 63 headers.");
        }
        var headerData = [];
        headers.forEach(function (value, name) {
            if (name.length > MAX_HEADER_SIZE || value.length > MAX_HEADER_SIZE) {
                throw new Error("Header names and values must be limited to 1023 bytes each.");
            }
            var nameBytes = BinaryMessageEncoder.stringToBytes(name);
            var valueBytes = BinaryMessageEncoder.stringToBytes(value);
            var nameLength = new Uint16Array([nameBytes.length]);
            var valueLength = new Uint16Array([valueBytes.length]);
            headerData.push(new Uint8Array(nameLength.buffer), nameBytes, new Uint8Array(valueLength.buffer), valueBytes);
        });
        // Combine header data into a single byte array
        var headerBytes = BinaryMessageEncoder.concatUint8Arrays(headerData);
        var offset = 0;
        for (var _i = 0, headerData_1 = headerData; _i < headerData_1.length; _i++) {
            var data = headerData_1[_i];
            headerBytes.set(data, offset);
            offset += data.byteLength;
        }
        var payloadBytes = BinaryMessageEncoder.stringToBytes(payload);
        if (payloadBytes.length > MAX_PAYLOAD_SIZE) {
            throw new Error("Payload size exceeds the limit of 256 KiB.");
        }
        var payloadLength = new Uint32Array([payloadBytes.byteLength]);
        var payloadLengthBytes = new Uint8Array(payloadLength.buffer);
        var encodedMessage = new Uint8Array(1 + headerBytes.byteLength + payloadLengthBytes.byteLength + payloadBytes.byteLength);
        encodedMessage[0] = headerCount;
        encodedMessage.set(headerBytes, 1);
        encodedMessage.set(payloadLengthBytes, 1 + headerBytes.byteLength);
        encodedMessage.set(payloadBytes, 1 + headerBytes.byteLength + payloadLengthBytes.byteLength);
        return encodedMessage;
    };
    return BinaryMessageEncoder;
}());
// Test
var headers = new Map();
headers.set("Content-Type", "application/json");
headers.set("Authorization", "12345");
var payload = 'Since candidate';
try {
    var encodedMessage = BinaryMessageEncoder.encodeMessage(headers, payload);
    console.log(headers);
    console.log("Encoded Message:", encodedMessage);
}
catch (error) {
    console.error(error);
}
