import { ItemTypes, SpotifyApi } from '@spotify/web-api-ts-sdk'
import dotenv from 'dotenv'
dotenv.config()

const spotify = SpotifyApi.withClientCredentials(`${process.env.SPOTIFY_CLIENTID}`, `${process.env.SPOTIFY_SECRET}`, [
  'user-read-private',
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private, user-read-playback-state, user-modify-playback-state'
])

const result = async (input: string, types: ItemTypes[]) => {
  const shows = await spotify.search(`${input}`, types, 'US')
  console.log(shows.shows?.items.map((item) => item.id))
  return shows
}

console.log(result('beattles', ['show']))
