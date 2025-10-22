import jwt from 'jsonwebtoken'

export const generateToken=(payload,secret,options)=>{
    return jwt.sign(payload,secret,options)

};
export const verfiyToken=(accessToken,secret)=>{
    return jwt.verify(accessToken,secret)
}
