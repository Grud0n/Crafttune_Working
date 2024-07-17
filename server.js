const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'rdbms.strato.de',  // Ersetze dies durch deinen Datenbank-Host
  user: 'dbu2694824',  // Ersetze dies durch deinen Datenbank-Benutzernamen
  password: 'Parkverb0t.23',  // Ersetze dies durch dein Datenbank-Passwort
  database: 'dbs12991951'  // Name der Datenbank
});

db.connect((err) => {
  if (err) throw err;
  console.log('Verbindung zur MariaDB-Datenbank hergestellt.');
});

app.use(bodyParser.json());
app.use(session({
  secret: 'geheime-schlüssel',
  resave: false,
  saveUninitialized: true
}));

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, hashedPassword], (err, result) => {
    if (err) {
      res.json({ success: false, message: 'Registrierung fehlgeschlagen' });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [username], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        req.session.user = user;
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Ungültiger Benutzername oder Passwort' });
      }
    } else {
      res.json({ success: false, message: 'Ungültiger Benutzername oder Passwort' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server läuft unter http://localhost:${port}/`);
});
