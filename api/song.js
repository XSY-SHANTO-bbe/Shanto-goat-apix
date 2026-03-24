// api/song.js
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegStatic); // Vercel-এ ffmpeg binary লোড করার জন্য

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const { url, query } = req.query;

  // যদি query দিয়ে song name দাও (যেমন: "Tumi Ashbe Bole")
  let videoUrl = url;
  if (!videoUrl && query) {
    // Simple search (আরও ভালো করতে youtube-search-api যোগ করতে পারো)
    console.log('Search not implemented yet, please send direct YouTube URL');
    return res.status(400).json({ error: 'Send YouTube URL' });
  }

  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="song.mp3"`);

    // Audio only stream
    const audioStream = ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    // MP3 তে convert করে stream করে দাও (Vercel-এ pipe করে পাঠানো হয়)
    ffmpeg(audioStream)
      .audioBitrate(128)          // 128kbps ভালো quality
      .format('mp3')
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        if (!res.headersSent) res.status(500).json({ error: 'Download failed' });
      })
      .pipe(res);                 // সরাসরি user/bot-কে পাঠিয়ে দেয়

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
