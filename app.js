const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const db = require('better-sqlite3')('logger.sqlitedb', { verbose: console.log });
db.pragma('journal_mode = WAL');

const port = 3001;
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {                         //Homepage
  var html = fs.readFileSync('./assets/html/topindex.html');
  res.write(html);
  const data = db.prepare('SELECT * FROM LOGGER;').all();
  res.write(`<center><table class="table table-striped" style="width:500px;">
    <thead class="thead-dark">
      <tr>
        <th scope="col">Date/Time</th>
        <th scope="col">Post Data</th>
      </tr>
    </thead>
    <tbody>`);
  data.forEach(row => {
    res.write('<tr><td>'+row.dt+'</td><td>'+row.postdata+'</td></tr>');
  });
  res.write(`</tbody>
    </table><center>`);
  var html = fs.readFileSync('./assets/html/botindex.html');
  res.end(html);
})

app.get('/test', (req, res) => {                         //Test
  var html = fs.readFileSync('./assets/html/topindex.html');
  res.write(html);
  const data = db.prepare('SELECT * FROM LOGGER;').all();
  res.write(`<form action="/log" method="POST">
    <div class="form-group">
      <label for="postdata">Post Data</label>
      <input type="text" class="form-control" name="postdata" id="postdata" placeholder="Data to post">
    </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>`);
  var html = fs.readFileSync('./assets/html/botindex.html');
  res.end(html);
})

app.post('/log', (req, res) => {             //Log post data
    let postdata = req.body.postdata;
    res.writeHead(200, {'Content-Type': 'text/html'});
    const data = db.prepare('INSERT INTO LOGGER (postdata) VALUES (?);').run(postdata);
    res.end('OK');
})

//Serves all the request which includes /images in the url from Images folder
app.use('/assets', express.static('./assets'));

app.listen(port, () => {
  console.log('App listening on port '+port+'!')
})
