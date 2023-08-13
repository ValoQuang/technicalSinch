export const MAX_HEADER_COUNT = 63;
export const MAX_HEADER_SIZE = 1023; //length
export const MAX_PAYLOAD_SIZE = 256 * 1024; // 256 KiB

export const MESSAGE_HEADER_AMOUNT = "A message can only have a maximum of 63 headers."
export const MESSAGE_HEADER_SIZE = "Header names and values must be limited to 1023 bytes each."
export const MESSAGE_PAYLOAD_SIZE = "Payload size exceeds the limit of 256 KiB."