import yts from "yt-search";
import ytdl from "@distube/ytdl-core";

export default async function handler(req, res) {
  const name = req.query.name;
  if (!name) {
    return res.json({
      status: "error",
      message: "গানের নাম দিন!"
    });
  }
  try {
    const search = await yts(name);
    const video = search.videos[0];
    if (!video) {
      return res.json({
        status: "error",
        message: "গান খুঁজে পাওয়া যায়নি!"
      });
    }
    const info = await ytdl.getInfo(video.url);
    const format = ytdl.chooseFormat(info.formats, {
      filter: "audioonly",
      quality: "highestaudio"
    });
    res.json({
      status: "success",
      title: video.title,
      duration: video.timestamp,
      thumbnail: video.thumbnail,
      downloadUrl: format.url
    });
  } catch (err) {
    res.json({
      status: "error",
      message: "সমস্যা হয়েছে!"
    });
  }
}
