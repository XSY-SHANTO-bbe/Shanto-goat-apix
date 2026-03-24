// api/song.js
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegStatic);

export default async function handler(req, res) {
  // শুধু GET method allowed
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET method allowed' });
  }

  const { url } = req.query;

  // URL না থাকলে error
  if (!url) {
    return res.status(400).json({
      error: 'YouTube URL দাও',
      example: 'https://shanto-goat-apix-a59s.vercel.app/song?url=https://youtu.be/dQw4w9wgxcq'
    });
  }

  // Valid YouTube URL কিনা চেক
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({
      error: 'Invalid YouTube URL',
      message: 'সঠিক লিঙ্ক দাও। উদাহরণ: https://youtu.be/xxxx অথবা https://www.youtube.com/watch?v=xxxx',
      example: 'https://shanto-goat-apix-a59s.vercel.app/song?url=https://youtu.be/dQw4w9wgxcq'
    });
  }

  try {
    console.log(`Downloading audio from: ${url}`);

    // Audio stream নেওয়া
    const stream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    // Response header সেট করা
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="song.mp3"`);

    // FFmpeg দিয়ে MP3 তে convert করে সরাসরি পাঠানো
    ffmpeg(stream)
      .audioBitrate(128)        // 128kbps ভালো quality
      .format('mp3')
      .on('start', () => {
        console.log('FFmpeg started converting...');
      })
      .on('error', (err) => {
        console.error('FFmpeg Error:', err.message);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to convert audio' });
        }
      })
      .pipe(res);               // সরাসরি browser/bot-কে পাঠিয়ে দেয়

  } catch (error) {
    console.error('Server Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Something went wrong on server',
        message: error.message 
      });
    }
  }
}
