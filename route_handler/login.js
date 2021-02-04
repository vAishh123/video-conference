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
        const hashpassword = await bcrypt.hash(password, 10)
        // console.log(name, email)
        const user = await User.find({ email });
        if (!user) {
            res.status(500).json({
                message: "User is not registered with us!"
            });
        }
        if (user.password !== hashpassword) {
            res.status(500).json({
                message: "Incorrect password!"
            });
        }
        res.status(200).json({
            message: "User Loggedin!",
            data: user
        });
    }
    catch (e) {
        console.log('error>> ', JSON.stringify(e));
        next(e);
    }

}
