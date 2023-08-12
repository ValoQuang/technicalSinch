import { BinaryMessageEncoder, MAX_HEADER_COUNT, MAX_PAYLOAD_SIZE, MAX_HEADER_SIZE } from "./EncodeMessage";

const headers = new Map<string, string>();
headers.set("Content-Type", "application/json");
headers.set("Authorization", "12345");

const payload = "Since candidate";

const result = [
  2, 12, 0, 67, 111, 110, 116, 101, 110, 116, 45, 84, 121, 112, 101, 16, 0, 97,
  112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 106, 115, 111, 110, 13, 0,
  65, 117, 116, 104, 111, 114, 105, 122, 97, 116, 105, 111, 110, 5, 0, 49, 50,
  51, 52, 53, 15, 0, 0, 0, 83, 105, 110, 99, 101, 32, 99, 97, 110, 100, 105,
  100, 97, 116, 101,
];

describe("EncodeMessage", () => {
  it("encodes a message and give correct result", () => {
    const encodedMessage = BinaryMessageEncoder.encodeMessage(headers, payload);
    expect(Array.from(encodedMessage)).toEqual(result);
  });

  it("give exceeded header amount error", () => {
    const exceededHeaders = new Map<string, string>();
    for (let i = 0; i < MAX_HEADER_COUNT + 1; i++) {
      exceededHeaders.set(`Header${i}`, `Value${i}`);
    }
    expect(() => {
      BinaryMessageEncoder.encodeMessage(exceededHeaders, payload);
    }).toThrowError("A message can only have a maximum of 63 headers.");
  });

  it("give header size error", () => {
    const exceededHeaders = new Map<string, string>();
    exceededHeaders.set('x'.repeat(MAX_HEADER_SIZE + 1), 'Some values');

    expect(() => {
        BinaryMessageEncoder.encodeMessage(exceededHeaders, payload);
      }).toThrowError("Header names and values must be limited to 1023 bytes each.");
  })

  it("give value size error", () => {
    const exceededValue = new Map<string, string>();
    exceededValue.set('Header', 'x'.repeat(MAX_HEADER_SIZE + 1));

    expect(() => {
        BinaryMessageEncoder.encodeMessage(exceededValue, payload);
      }).toThrowError("Header names and values must be limited to 1023 bytes each.");
  })

  it("give payload size error", () => {
    const exceededPayload = 'x'.repeat(MAX_PAYLOAD_SIZE + 1);
    expect(() => {
      BinaryMessageEncoder.encodeMessage(headers, exceededPayload);
    }).toThrowError("Payload size exceeds the limit of 256 KiB.");
  });
});
