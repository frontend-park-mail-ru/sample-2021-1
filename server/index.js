'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

const users = {
  'd.dorofeev@corp.mail.ru': {
    email: 'd.dorofeev@corp.mail.ru',
    password: 'password',
    age: 21,
    score: 3,
  },
  's.volodin@corp.mail.ru': {
    email: 's.volodin@corp.mail.ru',
    password: 'password',
    age: 23,
    score: 100500,
    images: [
        'https://instagram.fhel6-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/p750x750/150255292_459112698561063_2873154873011780672_n.jpg?_nc_ht=instagram.fhel6-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=wmebfCbqHfIAX8GrTSj&tp=1&oh=10788dbe767f6ad309ec3b4602e9d248&oe=6055F128',
        'https://scontent-hel3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s750x750/150795181_515526126080503_7842036583120888750_n.jpg?_nc_ht=scontent-hel3-1.cdninstagram.com&_nc_cat=107&_nc_ohc=AbLAyYk27iwAX8Z5Wfl&tp=1&oh=416931a2afd515e6ee9d718e0d1fc6bb&oe=60560BE5',
        'https://scontent-hel3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/p640x640/145341298_150862440094162_387299648990348394_n.jpg?_nc_ht=scontent-hel3-1.cdninstagram.com&_nc_cat=110&_nc_ohc=9S0F8oABGl4AX9gvmP7&tp=1&oh=1526409a2692790f7558efac6d9a9260&oe=6057763E',
    ]
  },
  'aleksandr.tsvetkov@corp.mail.ru': {
    email: 'aleksandr.tsvetkov@corp.mail.ru',
    password: 'password',
    age: 26,
    score: 72,
    images: [
        'https://instagram.fhel6-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/16583858_168051673696142_846500378588479488_n.jpg?_nc_ht=instagram.fhel6-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=LWXn28FGcKQAX8UOfCn&tp=1&oh=fc9f53ce0ee5047f522a758138512f75&oe=605808EA',
        'https://scontent-hel3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/19227380_1507297899309545_1356320152039194624_n.jpg?_nc_ht=scontent-hel3-1.cdninstagram.com&_nc_cat=105&_nc_ohc=noGkeCW2FCIAX97Hg9G&tp=1&oh=58b546b0c0dd68d7dc1a73da1c0147dd&oe=605746EC',
        'https://instagram.fhel6-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s750x750/20065516_1579389418799307_5149198199109451776_n.jpg?_nc_ht=instagram.fhel6-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=XCM4-UpiwLIAX_8hQ9r&tp=1&oh=5378fb2ea8d07576d70dd3a6250f5dff&oe=605891AB',
    ],
  },
  'a.ostapenko@corp.mail.ru': {
    email: 'a.ostapenko@corp.mail.ru',
    password: 'password',
    age: 21,
    score: 72,
  },
};
const ids = {};

app.post('/signup', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  const age = req.body.age;
  if (
      !password || !email || !age ||
      !password.match(/^\S{4,}$/) ||
      !email.match(/@/) ||
      !(typeof age === 'number' && age > 10 && age < 100)
  ) {
    return res.status(400).json({error: 'Не валидные данные пользователя'});
  }
  if (users[email]) {
    return res.status(400).json({error: 'Пользователь уже существует'});
  }

  const id = uuid();
  const user = {password, email, age, score: 0, images: []};
  ids[id] = email;
  users[email] = user;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(201).json({id});
});

app.post('/login', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  if (!password || !email) {
    return res.status(400).json({error: 'Не указан E-Mail или пароль'});
  }
  if (!users[email] || users[email].password !== password) {
    return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
  }

  const id = uuid();
  ids[id] = email;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(200).json({id});
});

app.get('/me', function (req, res) {
  const id = req.cookies['podvorot'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }

  users[email].score += 1;

  res.json(users[email]);
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
});
