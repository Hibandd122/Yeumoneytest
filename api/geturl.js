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

module.exports = (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");
  
  const siteName = (req.body?.site || "").toLowerCase().trim();
  for (const [name, url] of Object.entries(urls)) {
    if (name.toLowerCase().includes(siteName)) {
      return res.json({ url });
    }
  }
  res.status(404).json({ error: "Site not found" });
};
