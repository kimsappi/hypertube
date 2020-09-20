const axios = require('axios');
const mongoose = require('mongoose');

const ScrapedMovie = require('../models/ScrapedMovie');
const config = require('../utils/config');
const Logger = require('../utils/logger');

const baseUrl = 'https://movies-v2.api-fetch.sh/movies';

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on('error', err => {
  Logger.error('Mongoose connection error:');
  Logger.error(err);
});
mongoose.connection.on('connected', () => {
  Logger.log('Mongoose connected.');
});

const getMagnetLink = obj => {
  try {
    const language = obj.en ? obj.en : obj[Object.keys(obj)[0]];
    const quality = language['720p'] ?
      language['720p'] :
      language[Object.keys(language)[0]];
    return quality.url;
  } catch(err) {
    return null;
  }
};

const parsePage = arr => {
  return arr.map(movie => 
    ({
      imdbId: movie.imdb_id,
      title: movie.title,
      year: parseInt(movie.year),
      runtime: parseInt(movie.runtime),
      magnet: getMagnetLink(movie.torrents),
      poster: movie.images.poster,
      percentage: movie.rating.percentage,
      votes: movie.rating.votes
    })
  );
};

const scrape = () => {
  let page = 1;
  const scrapedMovies = [];
  const interval = setInterval(async () => {
    console.log(`Fetching page ${page}`);
    const res = await axios.get(baseUrl + '/' + page);
    if (!res.data.length || page === 2) {
      await ScrapedMovie.insertMany(scrapedMovies);
      clearInterval(interval);
      return;
    }
    scrapedMovies.push(...parsePage(res.data));
    ++page;
  }, 1000);
};

scrape();

// {
//   _id: 'tt3263904',
//   imdb_id: 'tt3263904',
//   title: 'Sully',
//   year: '2016',
//   synopsis: "On 15 January 2009, the world witnessed the 'Miracle on the Hudson' when Captain 'Sully' Sullenberger glided his disabled plane onto the frigid waters of the Hudson River, saving the lives of all 155 aboard. However, even as Sully was being heralded by the public and the media for his unprecedented feat of aviation skill, an investigation was unfolding that threatened to destroy his reputation and career.",
//   runtime: '96',
//   released: 1473379200,
//   certification: 'PG-13',
//   torrents: { en: [Object] },
//   trailer: 'http://youtube.com/watch?v=mjKEXxO2KNE',
//   genres: [ 'drama', 'history' ],
//   images: {
//     poster: 'http://image.tmdb.org/t/p/w500/5L29r3uwDe49XDMaK2xDkDht9t0.jpg',
//     fanart: 'http://image.tmdb.org/t/p/w500/phWZP5FESItyhQcqk6sWz35nUtP.jpg',
//     banner: 'http://image.tmdb.org/t/p/w500/5L29r3uwDe49XDMaK2xDkDht9t0.jpg'
//   },
//   rating: {
//     percentage: 78,
//     watching: 0,
//     votes: 20222,
//     loved: 100,
//     hated: 100
//   }
// }

// torrents: {
//   en: {
//     '1080p': {
//       url: 'magnet:?xt=urn:btih:6268ABCCB049444BEE76813177AA46643A7ADA88&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
//       seed: 2040,
//       peer: 1081,
//       size: 1771674010,
//       filesize: '1.65 GB',
//       provider: 'YTS'
//     },
//     '720p': {
//       url: 'magnet:?xt=urn:btih:A1D0C3B0FD52A29D2487027E6B50F27EAF4912C5&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
//       seed: 3344,
//       peer: 1699,
//       size: 837382308,
//       filesize: '798.59 MB',
//       provider: 'YTS'
//     }
//   }
// }
