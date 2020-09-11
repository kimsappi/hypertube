const express = require("express");
const app = express();
const cors = require("cors");

var torrentStream = require('torrent-stream');

// // connect to database
// const pool = require("./config/db");

// handles cross domain requests
app.use(cors());

// enable access to files in public folder
app.use(express.static('public'));


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

				const file = engine.files[0];

				// engine.files.forEach(file =>
				// 	{
				// 	allFileNames.push(file.name);
					console.log('filename:', file.name);
					console.log('file.length:', file.length);

					// This just pipes the read stream to the response object (which goes to the client) 
					const head = {
						'Accept-Ranges': 'bytes',
						'Cache-Control': 'no-cache, no-store',
						'Content-Range': `bytes 0-${file.length}/${file.length}`,
						'Content-Length': file.length,
						'Content-Type': 'video/mp4'
					};
					if (file.name.includes('mp4') || file.name.includes('mkv')) {
						// Create a readable stream to the file. Pieces needed by the stream will be prioritized highly.
						var stream = file.createReadStream();
						res.writeHead(206, head);
						console.log('streaming')
						stream.pipe(res)
					}

					// const parts = (range) ? range.replace(/bytes=/, '').split('-') : null
					// const start = (parts) ? parseInt(parts[0], 10) : 0
					// const end = (parts && parts[1]) ? parseInt(parts[1], 10) : file.length - 1

					// res.writeHead(206, {
					// 	'Accept-Ranges': 'bytes',
					// 	'Cache-Control': 'no-cache, no-store',
					// 	'Content-Range': `bytes ${start}-${end}/${file.length}`,
					// 	'Content-Length': parseInt(end - start) + 1,
					// 	'Content-Type': 'video/mp4'
					// })

				// 	//data: "ftypisomisomavc1,�moovlmvhd�(��(�X4 �@iodsO��)�Frtrak\tkhd�(��(�...

				// 	// console.log('stream:', stream);
				// });

				// res.json(allFileNames);
				// res.status(206);
				//json(engine.files);
			});

			// Emitted when the metadata has been fetched.
			engine.on('torrent', () => console.log("metadata has been fetched"));

			// Emitted everytime a piece has been downloaded and verified.
			engine.on('download', index =>
			{
				console.log(`part ${index} downloaded and verified`);
			});

			// Emitted when all selected files have been completely downloaded.
			engine.on('idle', () => console.log("all selected files have been completely downloaded"));
		}
		catch (err)
		{
			console.error(err.message);
		}
	}
);

app.listen(5000, () => { console.log("server has started on port 5000"); });