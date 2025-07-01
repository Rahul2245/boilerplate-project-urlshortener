require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
const dns = require('dns');
const urlParser = require('url');

let urlDatabase = [];



app.post("/api/shorturl",function(req,res){
  const originalurl =req.body.url;
  const hostname=url.urlParser.parse(originalurl).hostname;

  dns.lookup(hostname,function(err,address){
      if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = urlDatabase.length + 1;
    urlDatabase.push(originalUrl);
    
   res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });

  })






  
})
app.get("/api/shorturl/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const originalUrl = urlDatabase[id - 1];

  if (!originalUrl) {
    return res.json({ error: "No short URL found for the given input" });
  }

  res.redirect(originalUrl);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
