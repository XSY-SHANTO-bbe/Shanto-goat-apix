import ytSearch from 'yt-search';
import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { song } = req.query;

    if (!song) {
      return res.status(400).json({ status: 'error', message: 'গানের নাম দিন!' });
    }

    const trimmedSong = song.trim();

    // Step 1: Search
    const searchResults = await ytSearch(trimmedSong);
    const video = searchResults.videos[0];

    if (!video) {
      return res.status(404).json({ status: 'error', message: 'গান পাওয়া যায়নি' });
    }

    // Step 2: Get info (with timeout protection)
    const info = await ytdl.getInfo(video.url, { requestOptions: { timeout: 10000 } });

    const audio = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });

    res.json({
      status: 'success',
      title: video.title,
      url: video.url,
      audioStreamUrl: audio.url || 'No audio found',
      message: 'গান পাওয়া গেছে!'
    });

  } catch (err) {
    console.error('API Error:', err.message, err.stack);
    res.status(500).json({
      status: 'error',
      message: 'API crash: ' + err.message,
      details: err.stack ? err.stack.split('\n')[0] : 'No stack'
    });
  }
}
