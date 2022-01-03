import got from 'got';

export default class Proxy {
  constructor() {
    this.proxies = [];
  }

  async getProxies() {
    const regex = /[0-9]+(?:\.[0-9]+){3}:[0-9]+/gm;
    const { body } = await got('https://spys.me/proxy.txt');
    this.proxies = body.match(regex);

    return this.proxies;
  }

  getRandomProxy() {
    return this.proxies[Math.floor(Math.random() * this.proxies.length)];
  }
}
