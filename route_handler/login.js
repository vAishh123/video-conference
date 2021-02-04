const User = require('../dbschema/userRegisterSchema')
const bcrypt = require('bcryptjs')

module.exports = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('req.body ', password, ' ', email);
        if (!email || !password) {
            res.status(500).json({
                message: "Pass email and password"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(500).json({
                message: "User is not registered with us!"
            });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(500).json({
                message: "Incorrect password!"
            });
        }
        res.redirect('/room.ejs');
     //   res.status(200).json({
       //     message: "User Loggedin!",
         //   data: user
        //});
    }
    catch (e) {
        console.log('error>> ', e);
        // next(e);
    }

}
