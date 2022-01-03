import fs from 'fs';
import csv from 'csv-parser';

const playlist = new Map();

import { createObjectCsvWriter } from 'csv-writer';

const writer = createObjectCsvWriter({
  path: 'byPlays.csv',
  header: ['track', 'artist', 'playCount', 'plays'].map(id => ({
    id,
    title: id
  })),
  append: true
});

await new Promise(resolve => {
  fs.createReadStream('tracks.csv')
    .pipe(csv())
    .on('data', ({ track, artist, date }) => {
      const key = JSON.stringify({ track, artist });
      if (!playlist.has(key)) {
        playlist.set(key, []);
      }
      let playTimes = playlist.get(key);
      playTimes.push(date);
    })
    .on('end', async () => {
      for (const [key, plays] of playlist.entries()) {
        const { track, artist } = JSON.parse(key);
        await writer.writeRecords([
          {
            track,
            artist,
            plays,
            playCount: plays.length
          }
        ]);
      }

      resolve();
    });
});
