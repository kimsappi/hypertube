const express = require('express');
const torrentStream = require('torrent-stream');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const fs = require('fs');
var https = require('https');
const parse5 = require('parse5');
const unzipper = require('unzipper');

const srt2vtt = require('srt2vtt');
const srttovtt = require('srt-to-vtt')

const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
	useragent:'TemporaryUserAgent',
	username: 'asdhypertube',
	password: 'asdASD123',
	ssl: true
});

ffmpeg.setFfmpegPath(ffmpegPath);

const glob = require('glob');
const path = require("path");

const { verifyToken } = require('../utils/auth');
const movieListService = require('../services/movieLists');
const Logger = require('../utils/logger');

const Movie = require('../models/Movie');

const router = express.Router();

// SSE START ************************************************************

router.get("/subtitles/:magnet/:id/:imdb", (req,res) =>
{
	const { magnet, id, imdb } = req.params;

	// temporarily hardcoded, should be taken from config (context)
	const language = "eng";

	// 30 second server timeout (closes current connection and tries to create a new one)
	res.connection.setTimeout(600000);

	// create SSE connection
	const headers = {
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache',
		'Transfer-Encoding': 'compress'
	};
	res.writeHead(200, headers);

	// start torrent-stream engine
	const engine = torrentStream("magnet:?" + magnet, {
		connections: 100,     // Max amount of peers to be connected to.
		uploads: 1,          // Number of upload slots.
		tmp: "../public",
		path: "../public/" + id,
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

	// ***********************************************************************************************************
	// emitted when the metadata has been fetched.
	engine.on('torrent', () =>
	{
		res.write(`data: { "kind": "metadata" }\n\n`);
		console.log("\033[35mmetadata has been fetched 2\033[0m");
	})

	// ***********************************************************************************************************
	// emitted when the engine is ready to be used.
	engine.on('ready', () =>
	{
		console.log("ready activated");

		try
		{
			console.log("1. start async ------------------------------------------------------------------------")

			const path = __dirname + "/../../public/" + id + "/subs." + language + ".vtt";

			if (fs.existsSync(path))
			{
				const response = sendSubtitlesReady(engine.files);
				console.log("2. ready subtitles sent ---------------------------------------------------------------")
			}
			else
			{
				const response2 = sendSubtitlesAvailable(engine.files);
				console.log("3. available subtitles sent -----------------------------------------------------------")
			}
		}
		catch (err)
		{
			console.log(err);
		}

	});
	// ***********************************************************************************************************

	// send to client the names of all vtt-file names currently on server 
	const sendSubtitlesReady = (files) =>
	{
		glob('../public/' + id + '/*.vtt', {}, (err, files) =>
		{
			files.forEach(file =>
			{
				const name = path.basename(file);
				const parts = name.split(".");
				const lang = parts[1];
				res.write(`data: { "kind": "subtitles", "src": "http://localhost:5000/${id}/subs.${lang}.vtt", "srcLang": "${lang}", "name": "subs.${lang}.vtt", "default": ${lang === language ? "true" : "false"} }\n\n`);
			});
		})

		setTimeout(() => {
			files.forEach(file =>
			{
				if (file.name.includes(".mp4") || file.name.includes(".mkv"))
				{
					res.write(`data: { "kind": "movie", "name": "${file.name}", "size": ${file.length} }\n\n`);
				}
			});	
		}, 1000);
	}

	// iterate all files and send srt-file data to client
	const sendSubtitlesAvailable = (files) =>
	{
		files.forEach(file =>
		{
			if (file.name.includes(".srt"))
			{
				file.select();
				res.write(`data: { "kind": "available", "name": "${file.name}", "size": ${file.length} }\n\n`);
			}
		})
	}

	// ***********************************************************************************************************
	// emitted everytime a piece has been downloaded and verified.
	engine.on('download', index =>
	{
		res.write(`data: { "kind": "downloaded", "size": ${engine.swarm.downloaded} }\n\n`);
		console.log("\033[36mpart " + index +	" downloaded and verified 2\033[0m")
	})
	// ***********************************************************************************************************

	// ***********************************************************************************************************
	// emitted when all selected files have been completely downloaded.
	engine.on('idle', async () =>
	{
		console.log("idle activated");

		if (await hasCorrectSubtitles(engine.files))
		{
			console.log("has correct subtitles");
	
			convertSubtitles(engine.files);
			console.log("4. subtitles converted ----------------------------------------------------------------")
	
			setTimeout(() => {
				sendSubtitlesReady(engine.files);
				console.log("2. ready subtitles sent ---------------------------------------------------------------")
			}, 10000);
		}
		else
		{
			console.log("does NOT have correct subtitles");

			try
			{
				// download yifysubtitles html file and save it on server
				const url = "https://yifysubtitles.org/movie-imdb/" + imdb;
				const file = fs.createWriteStream(__dirname + "/../../public/" + id + "/tmp.html");
				https.get(url, (response) => {
					response.pipe(file)
				})
				setTimeout(() => {
					// read data from html file
					var data = fs.readFileSync(__dirname + "/../../public/" + id + "/tmp.html", 'utf8');
					const document = parse5.parse(data);

					// take tbody section from html
					const tbody = document.childNodes[1].childNodes[2].childNodes[9].childNodes[9].childNodes[6].childNodes[1].childNodes[3];

					// remove all rows where language is not "English"
					for (let i = 1; tbody.childNodes[i]; i += 2)
					{
						if (tbody.childNodes[i].childNodes[3].childNodes[1].childNodes[0].value !== "English") // hardcoded !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
						{
							tbody.childNodes.splice(i - 1, 2);
							i -= 2;
						}
					}

					// remove unused "text" rows from object
					for (let i = 0; tbody.childNodes[i]; i++)
						tbody.childNodes.splice(i, 1);

					// sort rows (most likes at the top)
					tbody.childNodes.sort((a, b) => {
						b.childNodes[1].childNodes[0].childNodes[0].value - a.childNodes[1].childNodes[0].childNodes[0].value;
					});

					// download subtitle zip-file and save it on server (currently uses hardcoded english subtitle)
					if (tbody.childNodes.length > 0)
					{
						const url = "https://yifysubtitles.org" + tbody.childNodes[0].childNodes[5].childNodes[1].attrs[0].value.replace("subtitles/", "subtitle/") + ".zip";
						
						https.get(url, (response) => {
							if (response.statusCode !== 404)
							{
								res.write(`data: { "kind": "available", "name": "yifysubtitles.org", "size": 50 }\n\n`);

								// pipe html document to zip file
								const file = fs.createWriteStream(__dirname + "/../../public/" + id + "/subs.zip");
								response.pipe(file)

								// unzip the first file inside the zip-file
								setTimeout(() => {
									fs.createReadStream(__dirname + "/../../public/" + id + "/subs.zip")
										.pipe(unzipper.ParseOne())
										.pipe(fs.createWriteStream(__dirname + "/../../public/" + id + "/subs." + language + ".srt"));
								}, 2000);
			
								// convert srt-file to vtt subtitle file
								// todo check if file is srt
								setTimeout(() => {
									const path = __dirname + "/../../public/" + id + "/subs." + language + ".srt";
									const pathNew = __dirname + "/../../public/" + id + "/subs." + language + ".vtt";

									fs.createReadStream(path)
										.pipe(srttovtt())
										.pipe(fs.createWriteStream(pathNew));
								}, 4000);
							}
						})
					}
					
				}, 3000);

				setTimeout(() => {
					convertSubtitles(engine.files);
					console.log("4. subtitles converted ----------------------------------------------------------------")	
				}, 8000);
		
				setTimeout(() => {
					sendSubtitlesReady(engine.files);
					console.log("2. ready subtitles sent ---------------------------------------------------------------")	
				}, 10000);
			}
			catch(err)
			{
				console.log(err);
			}
		}

	})
	// ***********************************************************************************************************

	const hasCorrectSubtitles = async (files) =>
	{
		let found = false;

		files.forEach(file =>
		{
			if (file.name.includes(".srt") && subtitleLanguage(file.name) === language)
				found = true;
		});
		return (found);
	}
	
	
	const convertSubtitles = async (files) =>
	{
		files.forEach(file =>
		{
			// create vtt-file if prefered languege does not already exist
			if (file.name.includes(".srt") && !subtitleAlreadyExists(file.name))
			{
				const path = __dirname + "/../../public/" + id + "/" + file.path;
				const newName = "subs." + subtitleLanguage(file.name) + ".vtt";
				const newPath = "../public/" + id + "/" + newName;
				
				convertSrtToVtt(path, newPath);

				console.log("converted", newPath)
			}
		});
	}

	// return subtitle language parsed from file name
	const subtitleLanguage = (fileName) =>
	{
		if (fileName.includes("YTS") || fileName.includes("YIFY"))
			return ("eng");
		else
		{
			const tmp = fileName.split(".");
			return (tmp[tmp.length - 2]);
		}
	}

	// return true if file already exists on server, otherwise return false
	const subtitleAlreadyExists = (fileName) =>
	{
		const name = "subs." + subtitleLanguage(fileName) + ".vtt";
		
		if (fs.existsSync(__dirname + "/../../public/" + id + "/" + name))
			return true;
		return false;
	}

	// convert srt-file to vtt-file
	const convertSrtToVtt = async (path, newPath) =>
	{	
		if (fs.existsSync(path) && !fs.existsSync(newPath))
		{
			fs.createReadStream(path)
				.pipe(srttovtt())
				.pipe(fs.createWriteStream(newPath));
		}
	}

	// ***********************************************************************************************************
	// when client or server timeout closes connection
	req.on('close', () =>
	{
		engine.destroy(() => console.log("engine destroyed!"));
		// engine.remove(() => console.log("engine removed!"));
		// res.end();
	});
})
// ***********************************************************************************************************
// SSE END ****************************************************************

router.get('/start/:magnet/:token/:imdb', async (req, res) => {
  const { magnet, token, imdb } = req.params;
  let retSubs = [];
  console.log(imdb);
  console.log('start');
  const engine = torrentStream("magnet:?" + magnet, {
    tmp: "../public",
    path: "../public/" + imdb,
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
let tries = 0;
  engine.on('ready', () =>
    {
      console.log("READY");
      engine.files.forEach(file =>
        {
          if (file.name.includes('.srt'))
          {
            file.select();
            console.log("SELECTED FILE:", file.name);
          }
        })

    })
    engine.on('torrent', () => console.log("\033[35mmetadata has been fetched\033[0m"));

    engine.on('download', () => console.log("\033[35mmetadata has been downloaded\033[0m"));
    
    engine.on('idle', () => {
      console.log("\033[36mAll subs downloaded\033[0m"); 
      // TAHAN VALIIN TEKSTITYSTEN TARKASTUS JA HAKU JA ALLA RES ANTAA URLIN TEKSTEIHIN.

      //search for srt files. If found, fun cb.

      setTimeout(() => {

        glob('../public/' + imdb + '/**/*.srt', {}, (err, files) => {
          console.log("LOYTYI: ");
          console.log(files);

          if (files.length)
          {

            //moving the subtitle file to imdb-folder.
            files.forEach((file) => {
              const filePath = file.split('/');
              const fileName = filePath[filePath.length - 1].split('.');
              const langIdentifier = fileName.length === 3 && fileName[1].length === 3 ? fileName[fileName.length - 2] : fileName.length === 2 && fileName[0].length <= 3 ? fileName[fileName.length - 2] : 'eng';
              fs.rename(file, '../public/' + imdb + '/sub.' + langIdentifier + '.srt', (err) => { if(err) console.log(err); });
            })
            //fs.rename(files[0], '../public/' + imdb + '/sub.srt', (err) => { if(err) console.log(err); });

            setTimeout(() => {
              
            glob('../public/' + imdb + '/*.srt', {}, (err, files) => {
              console.log("FILEESS: ", files);
              if (err)
                console.log("ERROR", err);
              files.forEach((file) => {
                let lang = file.split('/');
                lang = lang[lang.length - 1].split('.');
                var srtData = fs.readFileSync(file);
                srt2vtt(srtData, (err, vttData) => {
                  fs.writeFileSync('../public/' + imdb + '/sub.' + lang[lang.length - 2] + '.vtt', vttData);

                  retSubs.push(imdb + '/sub.' + lang[lang.length - 2] + '.vtt');
                })
              })
              console.log("RETURNATAAN: ", retSubs);
              console.log("jsut ennen sendia: ", retSubs);

              engine.destroy();
              if (res.headersSent)
                return;
              return res.status(200).json({sub: retSubs, message: 'found'});
              
            })

            
            

          }, 500)
            //convert srt2vtt. Timeout, that fs.rename has time to run..
            // setTimeout(() => {
            //   var srtData = fs.readFileSync('../public/' + imdb + '/sub.srt');
            
            //   srt2vtt(srtData, (err, vttData) => {
            //     if (err) console.log(err);
            //     fs.writeFileSync('../public/' + imdb + '/sub.vtt', vttData);
            //   })
            //   console.log("LOYTYYYY");

              
            // }, 1000);

              
          }
          else {
            engine.destroy()

            return res.status(200).send("subtitles not found");
          }
        })
      }, 500);
      
      
      //res.status(200).send("JEES");
      
  });
    

})

router.get('/:magnet/:token/:imdb', async (req, res, next) => {
  try {
    const { magnet, token, imdb } = req.params;
	// const token = req.query.token;
	
	console.log("magnet", magnet);
	console.log("token", token);

    const user = await verifyToken(token);
    if (!user)
      return res.status(401).json('auth error');


    // Saving movie into database or editing its lastViewed
    try {
      const dbMovie = new Movie({dirName: imdb, lastViewed: new Date()});
      await dbMovie.save();
    } catch(err) {
      // Movie is already in database, update lastViewed
      await Movie.findOneAndUpdate({dirName: imdb}, {lastViewed: new Date()});
    }

    // start engine

    
      const engine = torrentStream("magnet:?" + magnet, {
        tmp: "../public",
        path: "../public/" + imdb,
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

    // Experimental unnecessary engine destroyer
    res.on('close', () => {
      engine.destroy();
    });
    
    // emitted when the engine is ready to be used. 
    engine.on('ready', () =>
    {
      let file = null;
      // STREAM
      engine.files.forEach(currentFile => {
        if (!file || currentFile.length > file.length)
          file = currentFile;
      });

      const range = req.headers.range;

      console.log(range);

      const pos = range ? range.replace(/bytes=/, '').split('-') : null;
      const start = pos ? parseInt(pos[0], 10) : 0;
			const end = (pos && pos[1]) ? parseInt(pos[1], 10) : file.length - 1;
			
			const isMp4 = file.name.toLowerCase().endsWith('mp4');

      res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Content-Length': end - start + 1,
        'Content-Type': `video/${isMp4 ? 'mp4' : 'webm'}`
      });
			
			// Create Stream object from the selected part of the video file
      const originalFileStream = file.createReadStream({
        start: start,
        end: end
			});

			if (isMp4)
				originalFileStream.pipe(res)
			else {
				// Convert stream to mp4 format and stream to client
				ffmpeg(originalFileStream)
					.format('webm')
					.on('error', err => console.log('ffmpeg error:' +err.message))
					.pipe(res, {end: true});
			}
	})

    // emitted when the metadata has been fetched.
    engine.on('torrent', () => console.log("\033[35mmetadata has been fetched\033[0m"));

    // // emitted everytime a piece has been downloaded and verified.
	  engine.on('download', index => {console.log("\033[36mpart " + index +  " downloaded and verified\033[0m");});

    // emitted when all selected files have been completely downloaded.
    engine.on('idle', () => {
      console.log("\033[0;32mall selected files have been completely downloaded\033[0m");
      // This will prevent the streaming of the very last couple of seconds in Top Gun
      //engine.destroy();
    });

    // kill the stream somehow?

  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;