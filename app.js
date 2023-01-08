const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const timeAgo = require("node-time-ago");

const app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

app.get("/", (req, res) => {
  const posts = postBank.list();
  const HTML = `<!DOCTYPE html>
  <html>
    <head>
      <title>Wizard News</title>
      <link rel = "stylesheet" href="/style.css"/>
    </head>
      <body>
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
              <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${timeAgo(post.date)}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
  
  res.send(HTML)


});

app.get('/posts/:id',(req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  const HTML = `<!DOCTYPE html>
  <html>
    <head>
      <title>Wizard Post</title>
      <link rel = "stylesheet" href="/style.css"/>
    </head>
      <body>
        <a href = "/"><header><img src="/logo.png"/>Wizard News</header></a>
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <p>${post.content}</p>
        </div>
      </body>
  </html>`

  if (!post.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404)
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <a href="/"><header><img src="/logo.png"/>Wizard News</header></a>
      <div class="not-found">
        <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
        <img src="/dumbledore-404.gif" />
      </div>
    </body>
    </html>`
    res.send(html)
  }else{
  res.send(HTML)
  }
});


const { PORT = 1337} = process.env;

app.listen(PORT, () => {
console.log(`App listening in port ${PORT}`);
});
