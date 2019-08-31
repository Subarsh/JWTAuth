const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY, function(err, string){
            if(err) {
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
        })
        req.userdata = decodedToken;
        console.log('decodedToken ' + decodedToken)
        next();
    }catch(err){
        return res.status(401).json({
            message: 'Auth Failed'
        })
    }
}