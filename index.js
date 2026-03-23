const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

// Home
app.get("/", (req, res) => {
  res.send("✅ Shanto GoatBot API চলছে! 🐐");
});

// 🎵 YouTube Song Search + Download
// ব্যবহার: /song?name=shape of you
app.get("/song", async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.json({
      status: "error",
      message: "গানের নাম দিন! যেমন: /song?name=shape of you"
    });
  }

  try {
    // YouTube এ search করো
    const search = await yts(name);
    const video = search.videos[0];

    if (!video) {
      return res.json({
        status: "error",
        message: "গান খুঁজে পাওয়া যায়নি!"
      });
    }

    const videoUrl = video.url;
    const title = video.title;
    const duration = video.timestamp;
    const thumbnail = video.thumbnail;

    // Audio download করো
    const fileName = `song_${Date.now()}.mp3`;
    const filePath = path.join(__dirname, fileName);

    res.header("Content-Disposition", `attachment; filename="${fileName}"`);
    res.header("Content-Type", "audio/mpeg");
    res.header("X-Song-Title", encodeURIComponent(title));
    res.header("X-Song-Duration", duration);
    res.header("X-Song-Thumbnail", thumbnail);

    ytdl(videoUrl, {
      filter: "audioonly",
      quality: "highestaudio"
    }).pipe(res);

  } catch (err) {
    res.json({
      status: "error",
      message: "সমস্যা হয়েছে! আবার try করুন।"
    });
  }
});

// Quote
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
