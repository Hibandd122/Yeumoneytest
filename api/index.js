import express from "express";
import { createServer } from "http";
import { parse } from "url";
import { runWorkerLogic } from "api/lib/solve.js";

const app = express();
app.use(express.json());

const urls = {
  "vn88": "https://vn88zu.com",
  "m88": "https://bet88ve.com",
  "fb88": "https://fb88dq.com",
  "bk8": "https://bk8hn.com",
  "v9bet": "http://v9betlg.com",
  "188bet": "https://88betux.com",
  "w88": "https://w88abc.com",
  "fun88": "https://fun88de.com",
  "w88 w88xlm": "https://w88xlm.com"
};

app.post("/get-url", (req, res) => {
  const siteName = (req.body?.site || "").toLowerCase().trim();
  for (const [name, url] of Object.entries(urls)) {
    if (name.toLowerCase().includes(siteName)) {
      return res.json({ url });
    }
  }
  res.status(404).json({ error: "Site not found" });
});

app.post("/solve", async (req, res) => {
  try {
    const result = await runWorkerLogic();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message || "Unexpected error" });
  }
});

export default function handler(req, res) {
  const parsedUrl = parse(req.url, true);
  app.handle(req, res, parsedUrl);
}
