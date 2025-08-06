const { Worker } = require("worker_threads");
const axios = require("axios");
const crypto = require("crypto");
const os = require("os");

const API_ENDPOINT = "https://d.data-abc.com/f885cdeaf1/";
const MAX_NONCE = 5_000_000;

function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    hash >>>= 0;
  }
  return hash >>> 0;
}

function rng(state) {
  state ^= (state << 13) >>> 0;
  state ^= (state >>> 17);
  state ^= (state << 5) >>> 0;
  return state >>> 0;
}

function d(seed, length) {
  let state = fnv1a(seed);
  let out = '';
  while (out.length < length) {
    state = rng(state);
    out += state.toString(16).padStart(8, '0');
  }
  return out.slice(0, length);
}

function generateChallenges(token, c, s, dlen) {
  return Array.from({ length: c }, (_, i) => [
    d(token + (i + 1), s),
    d(token + (i + 1) + 'd', dlen)
  ]);
}

function runWorker(salt, target) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      `
        const { parentPort, workerData } = require("worker_threads");
        const crypto = require("crypto");
        const { salt, target, max } = workerData;
        const targetBuf = Buffer.from(target, "hex");
        for (let i = 0; i < max; i++) {
          const buf = Buffer.from(salt + i);
          const hash = crypto.createHash("sha256").update(buf).digest();
          if (hash.subarray(0, targetBuf.length).equals(targetBuf)) {
            parentPort.postMessage(i);
            return;
          }
        }
        parentPort.postMessage(null);
      `,
      { eval: true, workerData: { salt, target, max: MAX_NONCE } }
    );

    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const response = await axios.post(API_ENDPOINT + "challenge", {});
    const { token, challenge } = response.data;

    const challenges = generateChallenges(token, challenge.c, challenge.s, challenge.d);
    const results = await Promise.all(challenges.map(([salt, target]) => runWorker(salt, target)));

    if (results.some((r) => r === null)) {
      return res.status(500).json({ error: "Some challenges failed" });
    }

    const redeem = await axios.post(API_ENDPOINT + "redeem", {
      token,
      solutions: results
    });

    res.json({ result: redeem.data });
  } catch (error) {
    res.status(500).json({ error: error.message || "Unexpected error" });
  }
};
