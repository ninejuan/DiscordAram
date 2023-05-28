const client = require('./client')
const Distube = require('distube').default
const { SpotifyPlugin } = require('@distube/spotify')
const distube = new Distube(client, {
  emitNewSongOnly: false,
  searchSongs: 10,
  leaveOnFinish: true,
  leaveOnEmpty: false,
  plugins: [new SpotifyPlugin()]
});
module.exports = distube;