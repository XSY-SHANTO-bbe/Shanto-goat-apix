// api/song.js
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegStatic);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Valid YouTube URL দাও ( ?url=https://youtu.be/xxx )' });
  }

  try {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="song.mp3"');

    const stream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    ffmpeg(stream)
      .audioBitrate(128)
      .format('mp3')
      .on('error', (err) => {
        console.error('FFmpeg Error:', err);
        if (!res.headersSent) res.status(500).json({ error: 'Convert failed' });
      })
      .pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
