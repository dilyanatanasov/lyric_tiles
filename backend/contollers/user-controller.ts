import {userModel as User} from "../models/User";

export const getUser = async (req, res) => {
    const {username, password} = req.body;
    let user;
    try {
        if (username && password) {
            user = await User.findOne()
                .where("username").equals(username)
                .where("password").equals(password)
        } else {
            res.status(500).json({error: "Missing Username or Password"});
        }
    } catch (error) {
        res.status(500).json({error: "Something went wrong 1"});
    }
    res.status(200).json({user});
};
