import cheerio from 'cheerio';
import { domain } from './scrape.js';

export default function parse(text) {
  const $ = cheerio.load(text);

  const tracks = $('.list-playlist-item')
    .map((_i, el) => {
      const time = $('time', el).attr('datetime');
      const track = $('meta[itemprop="name"]', el).attr('content');
      const artist = $('dl > dd', el).last().text();
      return { time, track, artist };
    })
    .toArray();

  let timeframe;
  if (tracks.length > 0) {
    const date = new Date(tracks[0]?.time);
    date.setMinutes(0);
    timeframe = date.toISOString();
  }

  let next = $('button.btn-playlist-next').attr('data-src');
  if (next) next = `${domain}${next}?_pjax=#musikrecherche-playlist`;

  return { tracks, timeframe, next };
}
