const express = require("express");
const app = express();
const cors = require("cors");

const srt2vtt = require('srt-to-vtt')

const torrentStream = require('torrent-stream');

// handles cross domain requests
app.use(cors());

// enable access to files in public folder
app.use(express.static('public'));

const config = require('./config/config');

// play a movie
app.get('/api/cinema/:magnet/',
	async (req, res) =>
	{
		try
		{
			const { magnet } = req.params;

			// start engine
			const engine = torrentStream("magnet:?" + magnet, {
				tmp: "./public",
				path: "./public",
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
					// check video file type and store into a variable

					if (file.name.includes('mp4'))
					{
						const range = req.headers.range;
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
				});
			});

			// emitted when the metadata has been fetched.
			engine.on('torrent', () => console.log("\033[35mmetadata has been fetched\033[0m"));

			// // emitted everytime a piece has been downloaded and verified.
			engine.on('download', index => console.log("\033[36mpart " + index +  " downloaded and verified\033[0m"));

			// emitted when all selected files have been completely downloaded.
			engine.on('idle', () => console.log("\033[0;32mall selected files have been completely downloaded\033[0m"));

			// kill the stream somehow?

		}
		catch (err)
		{
			console.error(err.message);
		}
	}
);

app.listen(5000, () => { console.log("server has started on port 5000"); });