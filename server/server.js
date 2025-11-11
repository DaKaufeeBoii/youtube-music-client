const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/search', async (req, res) => {
  const { query, type, videoDuration, uploadDate } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const base = new URL('https://www.googleapis.com/youtube/v3/search');
  base.searchParams.set('part', 'snippet');
  base.searchParams.set('maxResults', '10');
  base.searchParams.set('q', query || '');
  if (type && type !== 'any') base.searchParams.set('type', type);
  if (videoDuration && videoDuration !== 'any' && (type === 'video' || !type)) {
    base.searchParams.set('videoDuration', videoDuration); // short|medium|long
    base.searchParams.set('type', 'video'); // duration requires video type
  }
  if (uploadDate && uploadDate !== 'any') {
    const now = new Date();
    let after;
    switch (uploadDate) {
      case 'hour':
        after = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'today':
        after = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        after = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        after = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        after = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        after = null;
    }
    if (after) base.searchParams.set('publishedAfter', after.toISOString());
  }
  base.searchParams.set('key', API_KEY);

  try {
    const response = await axios.get(base.toString());
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});