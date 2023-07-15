const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const {Op} = require('sequelize');
const {User, Post, Image, Comment} = require('../models');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /user
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ['password'] // 제외
                },  
                include: [{
                    model: Post,
                    attributes: ['id'] // 가져오기
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id']
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id']
                }]
            })
        const user = await User.findOne({
            where: { id: req.user.id }
        });
        res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/1/followers
    try {
        const user = await User.findOne({ where: {id: req.user.id }});
        if (!user) {
            res.status(403).send('존재하지 않는 사람을 팔로우 하려고 하시네요?');
        }
        const followers = await user.getFollowers({
            limit: parseInt(req.query.limit, 10)
        });
        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/followings', isLoggedIn, async (req, res, next) => { // GET /user/1/followings
    try {
        const user = await User.findOne({ where: {id: req.user.id }});
        if (!user) {
            res.status(403).send('존재하지 않는 사람을 팔로우 하려고 하시네요?');
        }
        const followings = await user.getFollowings({
            limit: parseInt(req.query.limit, 10)
        });
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:userId', async (req, res, next) => { // GET /user/1
    try {
        const fullUserWithoutPassword = await User.findOne({
            where: { id: req.params.userId },
            attributes: {
                exclude: ['password'] // 제외
            },  
            include: [{
                model: Post,
                attributes: ['id'] // 가져오기
            }, {
                model: User,
                as: 'Followings',
                attributes: ['id']
            }, {
                model: User,
                as: 'Followers',
                attributes: ['id']
            }]
        })
        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = data.Posts.length; // 개인정보 침해 예방
            data.Followers = data.Followers.length;
            data.Followings = data.Followings.length;

            res.status(200).json(data);
        }else {
            res.status(404).json('존재하지 않는 사용자 입니다');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST/user/login
// 미들웨어 확장
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        // 서버 에러
        if (err) {
            console.error(err);

            return next(err);
        }
        // 클라이언트 에러
        if (info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            if (loginErr) {
                console.error(loginErr);

                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ['password'], // 제외
                },  
                include: [{
                    model: Post,
                    attributes: ['id'] // 가져오기
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id']
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id']
                }]
            })
            return res.status(200).json(fullUserWithoutPassword);
        });
    }) (req, res, next);
});

router.get('/:userId/posts', async (req, res, next) => { // GET /user/1/posts
    try {
        const where = { UserId: req.params.userId };
        if (parseInt(req.query.lastId,10)) { // 초기 로딩이 아닐 때
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)} // id가 lastId보다 작은 것 불러옴
            }

        const posts = await Post.findAll({
            where,
            limit: 10, // 10개씩 가져오기
            order: [['createdAt', 'DESC'],
                    [Comment, 'createdAt', 'DESC']
                ],
            include: [{
                model: User, // 게시글 작성자
                attributes: ['id', 'nickname']
            }, {
                model: Image
            }, {
                model: Comment,
                include: [{
                    model: User, // 댓글 작성자
                    attributes: ['id', 'nickname']
                }]
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id']
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
                }, {
                    model: User,
                    as: 'Likers',
                    attributes: ['id']
                }, {
                    model: Image
                }]
            }]
        });
    res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// Post/user
router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        // 200: 성공, 300: 리다이렉트, 400: 클라이언트 에러, 500: 서버 에러
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디 입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword
        });
        res.status(201).send('ok');
    } catch (error) {
        console.error(error);
        next(error); // next: status=500
    }
});

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout(() => {
    req.session.destroy();
    res.send('ok');
    })
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await User.update({
            nickname: req.body.nickname
        }, {
            where: { id: req.user.id }
        });
        res.status(200).json({ nickname: req.body.nickname });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
    try {
        const user = await User.findOne({ where: {id: req.params.userId }});
        if (!user) {
            res.status(403).send('존재하지 않는 사람을 팔로우 하려고 하시네요?');
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => { // DELETE /user/1/follow
    try {
        const user = await User.findOne({ where: {id: req.params.userId }});
        if (!user) {
            res.status(403).send('존재하지 않는 사람을 언팔로우 하려고 하시네요?');
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { // DELETE /user/follower/2
    try {
        const user = await User.findOne({ where: {id: req.params.userId }});
        if (!user) {
            res.status(403).send('존재하지 않는 사람을 차단하려고 하시네요?');
        }
        await user.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;