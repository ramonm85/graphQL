const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {SECRET_KEY} = require('../../config')
const User = require('../../models/user');

module.exports = {
    Mutation: {
        async register(
            _, {
            registerInput:{ username, email, password, confirmPassword}
        }, 
            context, 
            info){
            //todo: validate user data
            //todo: make sure user doesnt exist
            //todo: hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser= new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            },SECRET_KEY, {expiresIn: '1h'} );

            return{
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
};