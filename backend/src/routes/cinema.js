const express = require('express');
const torrentStream = require('torrent-stream');

const fs = require('fs');
const srt2vtt = require('srt-to-vtt')

const { verifyToken } = require('../utils/auth');
const movieListService = require('../services/movieLists');
const Logger = require('../utils/logger');

const Movie = require('../models/Movie');

const router = express.Router();

router.get('/:magnet/:token', async (req, res, next) => {
  try {
    const { magnet, token } = req.params;
	// const token = req.query.token;
	
	console.log("magnet", magnet);
	console.log("token", token);

    const user = await verifyToken(token);
    if (!user)
      return res.status(401).json('auth error');

    // Add movie to user's watched movies
    try {
      movieListService.addToList(
        magnet,
        {...user, id: user.id},
        movieListService.Lists.watched
      );
    } catch(err) {
      Logger.error(err);
    }

    // Saving movie into database or editing its lastViewed
    try {
      const dbMovie = new Movie({magnet});
      await dbMovie.save();
    } catch(err) {
      // Movie is already in database
      const oldMovie = Movie.findOne({magnet});
      if (oldMovie.fullyDownloaded)
        console.log('Movie is already fully downloaded');
        // The above is not actually implemented yet
      await Movie.findOneAndUpdate({magnet}, {lastViewed: new Date()});
    }

    // start engine

    
      const engine = torrentStream("magnet:?" + magnet, {
        tmp: "../public",
        path: "../public" ,
        trackers: [
          "udp://glotorrents.pw:6969/announce",
          "udp://tracker.opentrackr.org:1337/announce",
          "udp://torrent.gresille.org:80/announce",
          "udp://tracker.openbittorrent.com:80",
          "udp://tracker.coppersurfer.tk:6969",
          "udp://tracker.leechers-paradise.org:6969",
          "udp://p4p.arenabg.ch:1337",
          "udp://tracker.internetwarriors.net:1337"
        ],
      });
    
    // emitted when the engine is ready to be used. 
    engine.on('ready', () =>
    {
      // STREAM
      engine.files.forEach(file =>
      {
		// // check video file type and store into a variable
		// if (file.name.includes(".srt"))
		// {
		// 	// find out language

		// 	const language = "en";

		// 	const split = file.path.split("/");

		// 	fs.createReadStream(__dirname + "/../../public/" + file.path)
		// 		.pipe(srt2vtt())
		// 		.pipe(fs.createWriteStream("../public/" + split[0] + "/" + "subs." + language + ".vtt"));
		// }

        if (file.name.includes('mp4'))
        {
          const range = req.headers.range;

          console.log(range);

          const pos = range ? range.replace(/bytes=/, '').split('-') : null;
          const start = pos ? parseInt(pos[0], 10) : 0;
          const end = (pos && pos[1]) ? parseInt(pos[1], 10) : file.length - 1;

          res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${file.length}`,
            'Content-Length': end - start + 1,
            'Content-Type': 'video/mp4'
          });
          
          file.createReadStream({
            start: start,
            end: end
          })
            .pipe(res);
          
		    }
        else
        {
			file.createReadStream();
		}
	  });
    });

    // emitted when the metadata has been fetched.
    engine.on('torrent', () => console.log("\033[35mmetadata has been fetched\033[0m"));

    // // emitted everytime a piece has been downloaded and verified.
	engine.on('download', index => console.log("\033[36mpart " + index +  " downloaded and verified\033[0m"));

    // emitted when all selected files have been completely downloaded.
    engine.on('idle', () => console.log("\033[0;32mall selected files have been completely downloaded\033[0m"));

    // kill the stream somehow?

  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
