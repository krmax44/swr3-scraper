import fs from 'fs/promises';
import path from 'path';
import got from 'got';
import Proxy from './utils/Proxy.js';
import parse from './parse.js';
import { createObjectCsvWriter } from 'csv-writer';

const writer = createObjectCsvWriter({
  path: 'tracks.csv',
  header: ['track', 'artist', 'time'].map(id => ({ id, title: id })),
  append: true
});

const proxy = new Proxy();
await proxy.getProxies();

export const domain = 'https://www.swr3.de';
const start = `${domain}/playlisten/index.html`;

let url = (await fs.readFile('last.txt', { encoding: 'utf-8' })) || start;
let first = url === start;

while (url) {
  const { body } = await got(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0'
    }
  });
  const { tracks, timeframe, next } = parse(body);
  if (first) {
    first = false;
    url = next;
    continue;
  }

  await writer.writeRecords(tracks);

  await fs.writeFile('last.txt', url);
  await fs.writeFile(path.join('raw', `${timeframe}.html`), body);
  console.log('done with', url);

  url = next;
}
