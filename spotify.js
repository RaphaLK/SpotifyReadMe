require('dotenv').config();

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = '';

// Get Access Token
const getAccessToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      }
    }
  );
  accessToken = response.data.access_token;
};

// Fetch Song Info
const getSongInfo = async (songId) => {
  const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
};

app.get("/song", async (req, res) => {
  const songId = "6aJn7Cst74cj4lNIiPRgav?si=a80a0cc3b76a4e7c"; // Put your specific song ID here
  await getAccessToken(); // Fetch access token before making request
  const songData = await getSongInfo(songId);
  res.send({
    name: songData.name,
    artist: songData.artists[0].name,
    album: songData.album.name,
    albumImageUrl: songData.album.images[0].url,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//https://open.spotify.com/track/6aJn7Cst74cj4lNIiPRgav?si=a80a0cc3b76a4e7c
