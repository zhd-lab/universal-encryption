// algo core : encryption & decryption without losses
export function encryptCalls(key, str) {
    const encryptedValues = [];
    const size = key.length;
    let keyIndex = key.length / 2;

    for (let i = 0; i < str.length; i++) {
        const charCodeStr = str.charCodeAt(i);
        const charCodeKey = key.charCodeAt(keyIndex);
        const encrypted = (charCodeStr + charCodeKey) % 256;
        encryptedValues.push(encrypted);
        keyIndex = (keyIndex + 1) % size;
    }

    // ECC stream layer
    const eccStream = eccPRNG(key, encryptedValues.length);
    const eccEncrypted = encryptedValues.map((val, i) => (val ^ eccStream[i]));

    return eccEncrypted.join(',');
}

export function decryptCalls(key, encryptedStr) {
    const encryptedValues = encryptedStr.split(',').map(Number);
    const size = key.length;
    let keyIndex = key.length / 2;

    const eccStream = eccPRNG(key, encryptedValues.length);
    const decryptedECC = encryptedValues.map((val, i) => (val ^ eccStream[i]));

    let decryptedOutput = '';
    for (let i = 0; i < decryptedECC.length; i++) {
        const value = decryptedECC[i];
        const charCodeKey = key.charCodeAt(keyIndex);
        const originalCharCode = (value - charCodeKey + 256) % 256;
        decryptedOutput += String.fromCharCode(originalCharCode);
        keyIndex = (keyIndex + 1) % size;
    }

    return decryptedOutput;
}

function eccPRNG(seed, length) {
    let s = [...seed.toString()].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const stream = [];
    for (let i = 0; i < length; i++) {
        s = (s * 13 + 7) % 256;
        stream.push(s);
    }
    return stream;
}
