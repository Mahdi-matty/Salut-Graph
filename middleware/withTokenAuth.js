const jwt = require("jsonwebtoken")
const { GraphQLError } = require('graphql');

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
// const AuthenticationError= new GraphQLError('Could not authenticate user.', {
//     extensions: {
//       code: 'UNAUTHENTICATED',
//     },
//   }),


  module.exports = {
    withTokenAuth : (req,res,next)=>{
        console.log(req.headers);
        const token  = req.headers?.authorization?.split(" ")[1];
        if(!token){
            console.log(`here`);
            return res.status(403).json({msg:"invalid token"})
        }
        try {
            const tokenData = jwt.verify(token,process.env.JWT_SECRET)
            req.tokenData=tokenData;
            console.log(`This is called`);
            console.log(req.tokenData);
            next()
        } catch (error) {
            console.log(`here II`);
            return res.status(403).json({msg:"invalid token"})
        }
    },
    AuthenticationError: new GraphQLError('Could not authenticate user.', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      }),
    
}