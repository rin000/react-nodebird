exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); // () 안에 무언가 있으면 에러처리 없으면 다음 미들웨어 처리
    } else {
        res.status(401).send('로그인이 필요합니다.');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('로그인 하지 않은 사용자만 접근 가능합니다.');
    }
};