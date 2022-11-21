const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();

db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

    passportConfig();

    app.use(morgan('dev'));
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true // cookie 전달
    }));
    app.use('/', express.static(path.join(__dirname, 'uploads')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser('nodebirdsecret'));
    app.use(session());
    app.use(passport.initialize());
    app.use(passport.session({
        saveUninitialized: false,
        resave: false,
        secret: process.env.COOKIE_SECRET
    }));

// app.get -> 가져오기
// app.post -> 생성
// app.put -> 전체 수정
// app.delete -> 제거
// app.patch -> 부분 수정
// app.options -> 찔러보기
// app.head -> 헤더만 가져오기(헤더/본문(바디))

app.get('/', (req, res) => {
    res.send('hello express');
});

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3065, () => {
    console.log('서버 실행중!');
});