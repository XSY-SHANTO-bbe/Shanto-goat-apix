export default async function handler(req, res) {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({
      error: "Search query required"
    });
  }

  try {
    const response = await fetch(`https://pinterest-api-one.vercel.app/?q=${encodeURIComponent(search)}`);
    const data = await response.json();

    res.status(200).json({
      owner: "Shanto",
      result: data
    });

  } catch (e) {
    res.status(500).json({
      error: "API failed"
    });
  }
}
