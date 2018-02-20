const express = require('express');
const bodyPaser = require('body-parser');
const session = require('express-session');
const axios = require('axios');

require('dotenv').config();

const app = express();
app.use(bodyPaser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
}));
app.use(express.static(`${__dirname}/../build`));

app.get('/auth/callback', (req, res) => {
  axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/auth/callback`,
  }).then(response => {
    // console.log('response.data', response.data);
    const accessToken = response.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`).then(r => {
      console.log('r.data', r.data);
      req.session.user = r.data;
      res.redirect('/');
    });
  }).catch(error => {
    console.log('error', error);
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.send();
});

app.get('/api/user-data', (req, res) => {
  res.json({ user: req.session.user });
});

function checkLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
}

app.get('/api/secure-data', checkLoggedIn, (req, res) => {
  res.json({ someSecureData: 123 });
});

const PORT = process.env.PORT || 3035;
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
