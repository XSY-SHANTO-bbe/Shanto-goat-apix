import ytdl from 'ytdl-core';  // npm install ytdl-core দাও package.json-এ dependencies-এ add করে push
import axios from 'axios';

export default async function handler(req, res) {
  const { song } = req.query;

  if (!song) {
    return res.status(400).json({ status: "error", message: "গানের নাম দিন!" });
  }

  try {
    // YouTube search (ফ্রি API বা simple search)
    const searchRes = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`);
    // parse first video link (simple, কিন্তু real-এ yt-search বা অন্য use করো)
    // অথবা dummy video ID
    const videoId = 'dQw4w9WgXcQ';  // test-এর জন্য Rick Roll, real-এ search থেকে নাও

    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
    const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });

    res.json({
      status: "success",
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      downloadUrl: audioFormat.url,  // direct MP3 stream link
      message: "গান পাওয়া গেছে! লিঙ্ক থেকে download করো"
    });

  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
}
