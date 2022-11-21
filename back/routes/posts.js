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

module.exports = router;