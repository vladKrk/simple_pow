import { sha256 } from 'js-sha256';

export default function pow(str, difficulty) {
    let nonce = 0;
    let hash = sha256(nonce + str);
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        nonce++;
        hash = sha256(nonce + str);
    }
    return { hash, nonce };
}