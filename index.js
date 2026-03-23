const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Shanto GoatBot API চলছে! 🐐");
});

app.get("/hello", (req, res) => {
  const name = req.query.name || "বন্ধু";
  res.json({
    status: "success",
    message: `হ্যালো ${name}! কেমন আছো? 😊`
  });
});

app.get("/quote", (req, res) => {
  const quotes = [
    "স্বপ্ন দেখো, কাজ করো, সফল হও 🌟",
    "প্রতিটি দিন একটি নতুন সুযোগ 💪",
    "ব্যর্থতা সাফল্যের প্রথম ধাপ 🚀",
    "কঠোর পরিশ্রমের কোনো বিকল্প নেই 🔥",
    "ধৈর্য ধরো, সময় সব ঠিক করে দেবে ⏳"
  ];
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ status: "success", quote: random });
});

app.listen(port, () => {
  console.log(`🚀 Server চলছে port ${port} এ`);
});
