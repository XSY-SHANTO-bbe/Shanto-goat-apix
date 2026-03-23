export default async function handler(req, res) {
  try {
    const { song } = req.query;  // query থেকে song নাও

    // query চেক (খালি/না থাকলে error)
    if (!song || song.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "গানের নাম দিন!"
      });
    }

    // এখানে success logic (এখন dummy, পরে real API add করতে পারো)
    const cleanedSong = song.trim();

    res.status(200).json({
      status: "success",
      song: cleanedSong,
      message: `${cleanedSong} এর জন্য রেসপন্স পাওয়া গেছে! 🎵 (টেস্ট মোড)`,
      lyrics: `এটা একটা টেস্ট লিরিক্স...\nVerse 1: ${cleanedSong}...\nChorus: লাভ ইউ...`,
      // যদি real lyrics API চাও, পরে add করবো (যেমন lyrics.ovh বা অন্য)
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "সার্ভারে সমস্যা: " + err.message
    });
  }
}
