const express = require("express");
const app = express();
const cors = require("cors");

const srt2vtt = require('srt-to-vtt')
const fs = require('fs')

const torrentStream = require('torrent-stream');

const path = require('path')

// handles cross domain requests
app.use(cors());

// enable access to files in public folder
app.use(express.static('public'));

const config = require('./config/config');


// // fixes image uploading size limit error
// app.use(express.json({ limit: '2mb' }));

// play a movie
app.get('/api/cinema/:magnet',
	async (req, res) => {
		console.log(req.header('Range'))
		let requestedRange = req.header('Range').split('=')[1].split('-');
		console.log(requestedRange)
		let start = parseInt(requestedRange[0]);
		let end = requestedRange[1];
		if (end === '')
			end = start + 1000000;
		else
			end = parseInt(end)
		let chunksize = end - start + 1;

		const filePath = path.join(__dirname, 'public/ZLAD.mp4');

		const fileSize = fs.statSync(filePath).size;

		const head = {
			'Accept-Ranges': 'bytes',
			'Cache-Control': 'no-cache, no-store',
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4'
		};

		res.writeHead(206, head);
		const stream = fs.createReadStream(filePath, {start, end});
		stream.pipe(res);
	}
);
	// {
	// 	try
	// 	{
	// 		const { magnet } = req.params;

	// 		// start engine
	// 		const engine = torrentStream("magnet:?" + magnet, {
	// 			tmp: "./public",
	// 			path: "./public",
	// 			trackers: [
	// 				"udp://glotorrents.pw:6969/announce",
	// 				"udp://tracker.opentrackr.org:1337/announce",
	// 				"udp://torrent.gresille.org:80/announce",
	// 				"udp://tracker.openbittorrent.com:80",
	// 				"udp://tracker.coppersurfer.tk:6969",
	// 				"udp://tracker.leechers-paradise.org:6969",
	// 				"udp://p4p.arenabg.ch:1337",
	// 				"udp://tracker.internetwarriors.net:1337"
	// 			],
	// 		});

	// 		//console.log(req.head);

	// 		// emitted when the engine is ready to be used. 
	// 		engine.on('ready', () =>
	// 		{
	// 			// sort by size and stream only the largest file?

	// 			// add some way of checking if everything has already been downloaded
	// 			// it's hardcoded here for testing purposes
	// 			let completelyDownloaded = true;

	// 			// if already downloaded, return url to static file, else return stream
	// 			if (completelyDownloaded)
	// 			{
	// 				// let data = [];
	// 				console.log(req.header('Range'))
	// 				let requestedRange = req.header('Range').split('=')[1].split('-');
	// 				console.log(requestedRange)
	// 				let start = requestedRange[0];
	// 				let end = requestedRange[1];
	// 				if (end === '');
	// 					end = parseInt(start) + 1000000;
	// 				let chunksize = end - start + 1;

	// 				engine.files.forEach(file =>
	// 				{
	// 					const head = {
	// 						'Accept-Ranges': 'bytes',
	// 						'Cache-Control': 'no-cache, no-store',
	// 						'Content-Range': `bytes ${start}-${end}/${file.length}`,
	// 						'Content-Length': chunksize + 1,
	// 						'Content-Type': 'video/mp4'
	// 					};
	// 					if (file.name.includes('.mp4') || file.name.includes('.mkv'))
	// 					{
	// 						var stream = file.createReadStream({start, end});
	// 						res.writeHead(206, head);
	// 						console.log('\033[35mstreaming\033[0m')
	// 						stream.pipe(res);
	// 						//console.log("res", res);
	// 					}

	// 					// if (file.name.includes(".mp4") || file.name.includes(".mkv"))
	// 					// 	res.json({
	// 					// 		isStream: false,
	// 					// 		videoUrl: config.SERVER_URL + "/" + file.path
	// 					// 	});	

	// 					// if (file.name.includes(".mp4") || file.name.includes(".mkv"))
	// 					// {
	// 					// 	data.push({
	// 					// 		video: "http://localhost:5000/" + file.path
	// 					// 	})
	// 					// }
	// 					// else if (file.name.includes("[YTS.MX].srt"))
	// 					// {
	// 					// 	fs.createReadStream('some-subtitle-file.srt')
	// 					// 		.pipe(srt2vtt())
	// 					// 		.pipe(fs.createWriteStream('some-html5-video-subtitle.vtt'))

	// 					// 	data.push({
	// 					// 		subtitles: "http://localhost:5000/" + file.path
	// 					// 	})
	// 					// }	
	// 				});
	// 				// res.json(data);
	// 			}
	// 			else // stream
	// 			{
	// 				engine.files.forEach(file =>
	// 				{
	// 					console.log("----------------------");
	// 					console.log('filename:', file.name);
	// 					console.log('path:', file.path);
	// 					console.log('length:', file.length);
	
	// 					// This just pipes the read stream to the response object (which goes to the client) 
	// 					const head = {
	// 						'Accept-Ranges': 'bytes',
	// 						'Cache-Control': 'no-cache, no-store',
	// 						'Content-Range': `bytes 0-${file.length}/${file.length}`,
	// 						'Content-Length': file.length,
	// 						'Content-Type': 'video/mp4'
	// 					};
	// 					if (file.name.includes('mp4') || file.name.includes('mkv'))
	// 					{
	// 						var stream = file.createReadStream();
	// 						res.writeHead(206, head);
	// 						console.log('\033[35mstreaming\033[0m')
	// 						stream.pipe(res);
	// 						console.log("res", res);
	// 					}
	// 				});
	// 			}
	// 			// res.status(206);
	// 			//json(engine.files);
	// 		});

	// 		// emitted when the metadata has been fetched.
	// 		engine.on('torrent', () => console.log("\033[35mmetadata has been fetched\033[0m"));

	// 		// emitted everytime a piece has been downloaded and verified.
	// 		engine.on('download', index => console.log("\033[36mpart " + index +  " downloaded and verified\033[0m"));

	// 		// emitted when all selected files have been completely downloaded.
	// 		engine.on('idle', () => console.log("\033[0;32mall selected files have been completely downloaded\033[0m"));
	// 	}
	// 	catch (err)
	// 	{
	// 		console.error(err.message);
	// 	}
	// }
// );

app.listen(5000, () => { console.log("server has started on port 5000"); });
