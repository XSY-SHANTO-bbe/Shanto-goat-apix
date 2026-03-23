import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';

export default async function handler(req, res) {
  try {
    const { song } = req.query;

    if (!song || song.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'গানের নাম দিন!'
      });
    }

    // YouTube search
    const searchResults = await ytSearch(song);
    const video = searchResults.videos[0];  // প্রথম রেজাল্ট নাও

    if (!video) {
      return res.status(404).json({
        status: 'error',
        message: 'গান পাওয়া যায়নি'
      });
    }

    // Video info + audio format
    const info = await ytdl.getInfo(video.url);
    const audioFormat = ytdl.chooseFormat(info.formats, {
      filter: 'audioonly',
      quality: 'highestaudio'
    });

    res.status(200).json({
      status: 'success',
      title: video.title,
      duration: video.duration.timestamp,
      views: video.views,
      thumbnail: video.thumbnail,
      downloadUrl: audioFormat.url,  // direct audio stream link
      message: `${video.title} পাওয়া গেছে! লিঙ্ক থেকে শুনো/ডাউনলোড করো`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'সার্ভার এরর: ' + (err.message || 'অজানা সমস্যা')
    });
  }
}
