const jwt = require("jsonwebtoken")

// const withTokenAuth = (req,res,next)=>{
//     console.log(req.headers);
//     const token  = req.headers?.authorization?.split(" ")[1];
//     if(!token){
//         console.log(`here`);
//         return res.status(403).json({msg:"invalid token"})
//     }
//     try {
//         const tokenData = jwt.verify(token,process.env.JWT_SECRET)
//         req.tokenData=tokenData;
//         console.log(`This is called`);
//         console.log(req.tokenData);
//         next()
//     } catch (error) {
//         console.log(`here II`);
//         return res.status(403).json({msg:"invalid token"})
//     }
// };


//   module.exports = withTokenAuth 
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
    return req;
  },
  signToken: function ({ username, email, id }) {
    const payload = { username, email, id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};