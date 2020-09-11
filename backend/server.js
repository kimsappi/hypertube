const express = require("express");
const app = express();
const cors = require("cors");

var torrentStream = require('torrent-stream');

// // connect to database
// const pool = require("./config/db");

// enable access to files in public folder
app.use(express.static('public'));

// handles cross domain requests
app.use(cors());

// // fixes image uploading size limit error
// app.use(express.json({ limit: '2mb' }));

// play a movie
app.get('/api/cinema/:magnet',
	async (req, res) =>
	{
		try
		{
			const { magnet } = req.params;

			// start engine
			const engine = torrentStream("magnet:?" + magnet, {
				tmp: "/home/taho/hive/hypertube/backend/public",
				path: "/home/taho/hive/hypertube/backend/public",
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

			// Emitted when the engine is ready to be used. 
			engine.on('ready', () =>
			{
				let allFileNames = [];
				let allStreams = [];

				engine.files.forEach(file =>
					{
					allFileNames.push(file.name);
					console.log('filename:', file.name);

					// Create a readable stream to the file. Pieces needed by the stream will be prioritized highly.
					var stream = file.createReadStream();

					// console.log('stream:', stream);
				});

				// res.json(allFileNames);
				res.json(engine.files[0].name);
			});
		}
		catch (err)
		{
			console.error(err.message);
		}
	}
);

app.listen(5000, () => { console.log("server has started on port 5000"); });