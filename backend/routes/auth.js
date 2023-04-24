const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = 'Rushinisa$goodb$oy';

//  Route: 1 Create a user using: POST "/api/auth/createuser" . Doesnt require auth
router.post('/creatuser', [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email Address').isEmail(),
    body('password', 'Enter a Valid Password').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    //  If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // check wether the user with this email exist already
    try {
        var user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this emial already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // create a new user    
        var user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})
//  Route 2: Authenticate a user using: POST "/api/auth/login" . Doesnt require login
router.post('/login', [
    body('email', 'Enter a Valid Email Address').isEmail(),
    body('password', 'Password cannot be empty').exists()
], async (req, res) => {
    //  If there are errors, return bad request and the errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({success , errors: errors.array() });

    }
    const { email, password } = req.body;
    try {
        var user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success , error: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({success,  error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})
//  Route 3:Get logged in user details. POST "/api/auth/getuser" . Login Required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userID = req.user.id;
        const user = await User.findById(userID).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
module.exports = router

// "name": "Nick Fury",
//   "email": "sheild@gmail.com",
//   "password": "sheildforever"

// "name": "Thor Odinson"
// "email": "asguard@gmail.com",
//   "password": "ILoveasguard"