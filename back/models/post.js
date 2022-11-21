const DataTypes = require('sequelize');
const {Model} = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
    return super.init({
        // id가 기본적으로 들어있다
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // RetweetId
    }, {
        modelName: 'Post',
        tableName: 'posts',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // 이모티콘 저장
        sequelize
    });
}
    static associate (db) {
        // belongsTo: 관계를 맺는 대상(부모)에게 외래 키를 받아 추가한다
        // belongsToMany: source를 여러개의 target에 연결할 때 사용, target 또한 여러개의 source에 연결될 수 있다.
        // hasMany: 관계를 맺는 대상(자식)에게 자신의 외래 키를 추가, 복수의 데이터 추가 가능

        db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
        db.Post.hasMany(db.Comment); // post.addComments, post.getComments
        db.Post.hasMany(db.Image); // post.addImages, post.getImages
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers
        db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
    }
};