const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../../models/user")

module.exports = {
    createUser: async (args) =>{  
        try {
       const existingUser = await User.findOne({email: args.userInput.email})
            if(existingUser){
                throw new Error(" User exist already")
            }
           const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
    
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
           const result = await user.save()
                return {...result._doc};
            }
            catch(err){
                throw err
            }
        },
        login: async({email, password}) => {
            const user = await User.findOne({email})
            if(!user){
                throw new Error('User does not exist')
            }
            const isEqual = await bcrypt.compare(password, user.password)
            if(!isEqual){
                throw new Error('Password is incorrect')
            }
            const token = jwt.sign({userId: user.id, email: user.email},'hashingtoken', {
                expiresIn: '1h' // keep them short-lived in case they get stolen
            })
            return { userId: user.id, token, tokenExpiration: 1}
        }
}