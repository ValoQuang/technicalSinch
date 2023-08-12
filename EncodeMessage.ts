
// Define the maximum limits
const MAX_HEADER_COUNT = 63;
const MAX_HEADER_SIZE = 1023;
const MAX_PAYLOAD_SIZE = 256 * 1024; // 256 KiB

class BinaryMessageEncoder {

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

    static encodeMessage(headers: Map<string, string>, payload: string): Uint8Array {
        //maximum headers 63
        const headerCount = Math.min(headers.size, MAX_HEADER_COUNT);
        if (headers.size > MAX_HEADER_COUNT) {
            throw new Error("A message can have a maximum of 63 headers.");
        }
        const headerData: Uint8Array[] = [];

        headers.forEach((value, name) => {
            if (name.length > MAX_HEADER_SIZE || value.length > MAX_HEADER_SIZE) {
                throw new Error("Header names and values must be limited to 1023 bytes each.");
            }
            const nameBytes = new TextEncoder().encode(name);
            const valueBytes = new TextEncoder().encode(value);

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

        const payloadBytes = new TextEncoder().encode(payload);

        if (payloadBytes.length > MAX_PAYLOAD_SIZE) {
            throw new Error("Payload size exceeds the limit of 256 KiB.");
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
}

// Example usage
const headers = new Map<string, string>();
headers.set("Content-Type", "application/json");
headers.set("Authorization", "12345");

const payload = 'I am Since candidata';

try {
    const encodedMessage = BinaryMessageEncoder.encodeMessage(headers, payload);
    console.log("Encoded Message:", encodedMessage);
} catch (error) {
    console.error("Error:", error);
}

