const express = require('express');
const { Op } = require('sequelize');

const {Post, Image, User, Comment} = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
    try {
        const where = {};
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

router.get('/related', async (req, res, next) => { // GET /related
    try {
        const followings = await User.findAll({
            attributes: ['id'],
            include: [{
                model: User,
                as: 'Followers',
                where: { id: req.user.id }
            }]
        });
        const where = {
            UserId: { [Op.in]: followings.map((v) => v.id) }
        };
        if (parseInt(req.query.lastId,10)) { // 초기 로딩이 아닐 때
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)} // id가 lastId보다 작은 것 불러옴
            }

        const posts = await Post.findAll({
            where,
            limit: 10, // 10개씩 가져오기
            order: [ ['createdAt', 'DESC'],
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
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id']
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
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

router.get('/unrelated', async (req, res, next) => { // GET /unrelated
    try {
        const followings = await User.findAll({
            attributes: ['id'],
            include: [{
                model: User,
                as: 'Followers',
                where: { id: req.user.id }
            }]
        });
        const where = {
            UserId: { [Op.notIn]: followings.map((v) => v.id).concat(req.user.id) }
        };
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
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id']
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
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

module.exports = router;