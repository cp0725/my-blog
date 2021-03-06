//simi ,相似歌曲
module.exports = (req, res, createWebAPIRequest, request) => {
  const cookie = req.get("Cookie") ? req.get("Cookie") : "";
  const data = {
    songid: req.query.id
  };
  createWebAPIRequest(
    "music.163.com",
    "/weapi/v1/discovery/simiSong",
    "POST",
    data,
    cookie,
    music_req => {
      res.send(music_req);
    },
    err => res.status(502).send("fetch error")
  );
};
