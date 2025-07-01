require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const urlParser = require('url');

const app = express();


const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Needed to parse JSON POST bodies

app.use('/public', express.static(`${process.cwd()}/public`));

// Serve index.html
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


let urlDatabase = {};
let counter = 1;


app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

 
  const urlFormat = /^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,}.*$/;
  if (!urlFormat.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const hostname = urlParser.parse(originalUrl).hostname;


  dns.lookup(hostname, (err) => {
    if (err) return res.json({ error: 'invalid url' });


    const existingEntry = Object.entries(urlDatabase).find(
      ([shortUrl, storedUrl]) => storedUrl === originalUrl
    );

    if (existingEntry) {
      return res.json({
        original_url: originalUrl,
        short_url: parseInt(existingEntry[0])
      });
    }


    const shortUrl = counter++;
    urlDatabase[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });
  });
});


app.get('/api/shorturl/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const originalUrl = urlDatabase[id];

  if (!originalUrl) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  res.redirect(originalUrl);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
