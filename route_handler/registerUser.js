const User = require('../dbschema/userRegisterSchema')
const bcrypt = require('bcryptjs')

module.exports = async (req, res) => {
    console.log('req.body 63 >> ', req.body.name, ' ', req.body.email)

    try {
        console.log(req.body);
        const hashPassword = await bcrypt.hashSync(req.body.password, 10);
        userName = req.body.name;
        email = req.body.email;
        password = hashPassword;
        if (userName && email) {
            User.create({
                userName,
                email,
                password
            }).then((doc) => {
                console.log(doc);
                res.redirect('/login')
            }).catch((e) => {
                throw (e)
            })
        } else {
            throw ('user data is not valid');
        }

        //   users.push({
        //     id: Date.now().toString(),
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: hashedPassword
        //   })
    }
    catch (e) {
        console.log('error>> ', JSON.stringify(e))
        res.redirect('/register')
    }
    // console.log(users)

}
