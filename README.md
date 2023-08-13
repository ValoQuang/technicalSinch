# TechnicalSinch

Implementation a simple binary message encoding scheme to be used in signaling protocol.
A message contains Header { name, value } and Payload { string }. 

Conditions: 
- Header amount maximum is 63.
- Header name size maximum is 1023.
- Header value size maximum is 1023.
- Header must be converted from string to ASCII encoded.
- Payload { string } size maximum is 256 * 1024.

Criteria:
- Handling error if one of conditions is not met.
- Clear code presentation.

# Summary
The encode is logic is down to 2 main parts:
First part Header: 
1. Loop through Header object using forEach(name, value).
2. Check if header name and value meet the listed condition.
3. Use stringToBytes to convert name and value. It loops through the string.length then create bytes array.  
Then,nameLength and valueLength are Uint16Array arrays, Uint16Array to check if the header's name opr value fits the condition. Now each contains a single element: the length of nameBytes and valueBytes.
4. Push the name value bytes into one array, new Uint8Array(nameLength.buffer) for name and value is added in between.
Buffer in this case is needed because without, it would lead to unintended behavior and potentially incorrect data manipulation.

Second part Payload:
1. Convert payload string to bytes with helper function.
2. Check if converted payload is met condition.
3. Encode message with scheme.
   - Encode message is a new Uint8Array.
   - First byte is reserved for the header count => "1+", this way to quickly count the number of headers.
   - Define encodedMessage
    ```
    const encodedMessage = new Uint8Array(1 + headerBytes.byteLength + payloadLengthBytes.byteLength + payloadBytes.byteLength);
    ``` to allocate memory, to ensure we have enough space to store the message.
   - Then set headerBytes starting at index 1, after the header count
    ```
    encodedMessage[0] = headerCount;
    encodedMessage.set(headerBytes, 1);
    ```    


<img width="778" alt="image" src="https://github.com/ValoQuang/technicalSince/assets/45687913/593cd771-8f2f-4045-b4eb-ed106a59faa5">
