const DataTypes = require('sequelize');
const {Model} = DataTypes;


module.exports = class Post extends Model { 
    static init(sequelize) {
        return super.init({
            // id가 기본적으로 들어있다
            email: {
                type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
                allowNull: false, // false = 필수
                unique: true // 고유한 값
            },
            nickname: {
                type: DataTypes.STRING(30),
                allowNull: false // false = 필수
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false // false = 필수
            }
        }, {
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8', //
            collate: 'utf8_general_ci', // 한글 저장
            sequelize
        });
    }

    static associate(db) {
        // through: 중간 테이블 이름을 바꿈
        // as: db.User의 이름을 바꿈(별칭) 
        // foreignKey: 컬럼의 Id 이름을 바꿈
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); 
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
    }
};