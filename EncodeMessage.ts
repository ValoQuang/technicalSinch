import * as ENUM from "./utils/enum";

export class BinaryMessageEncoder {
    // Helper function to concatenate Uint8Arrays
    private static concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
        const totalLength = arrays.reduce((acc, arr) => acc + arr.byteLength, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.byteLength;
        }
        return result;
    }

     // Helper function to convert a string to an array of ASCII codes (bytes)
     private static stringToBytes(input: string): Uint8Array {
        const bytes = new Uint8Array(input.length);
        for (let i = 0; i < input.length; i++) {
            bytes[i] = input.charCodeAt(i) & 0xFF; // Keep only the lowest 8 bits (ASCII)
        }
        return bytes;
    }

    static encodeMessage(headers: Map<string, string>, payload: string): Uint8Array {
        //Maximum headers 63
        const headerCount = Math.min(headers.size, ENUM.MAX_HEADER_COUNT);
        if (headers.size > ENUM.MAX_HEADER_COUNT) {
            throw new Error(ENUM.MESSAGE_HEADER_AMOUNT);
        }
        const headerData: Uint8Array[] = [];

        headers.forEach((value, name) => {
            if (name.length > ENUM.MAX_HEADER_SIZE || value.length > ENUM.MAX_HEADER_SIZE) {
                throw new Error(ENUM.MESSAGE_HEADER_SIZE);
            }
            const nameBytes = BinaryMessageEncoder.stringToBytes(name);
            const valueBytes = BinaryMessageEncoder.stringToBytes(value);

            const nameLength = new Uint16Array([nameBytes.length]);
            const valueLength = new Uint16Array([valueBytes.length]);

            headerData.push(new Uint8Array(nameLength.buffer), nameBytes, new Uint8Array(valueLength.buffer), valueBytes);
        });

        // Combine header data into a single byte array
        const headerBytes = BinaryMessageEncoder.concatUint8Arrays(headerData);

        let offset = 0;
        for (const data of headerData) {
            headerBytes.set(data, offset);
            offset += data.byteLength;
        }

        const payloadBytes = BinaryMessageEncoder.stringToBytes(payload);

        if (payloadBytes.length > ENUM.MAX_PAYLOAD_SIZE) {
            throw new Error(ENUM.MESSAGE_PAYLOAD_SIZE);
        }

        const payloadLength = new Uint32Array([payloadBytes.byteLength]);
        const payloadLengthBytes = new Uint8Array(payloadLength.buffer);

        const encodedMessage = new Uint8Array(1 + headerBytes.byteLength + payloadLengthBytes.byteLength + payloadBytes.byteLength);
        encodedMessage[0] = headerCount;
        encodedMessage.set(headerBytes, 1);
        encodedMessage.set(payloadLengthBytes, 1 + headerBytes.byteLength);
        encodedMessage.set(payloadBytes, 1 + headerBytes.byteLength + payloadLengthBytes.byteLength);

        return encodedMessage;
    }
};
