const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const axios = require('axios');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const UserData = require('../models/user.model')

router.post('/login', async (req, res) => {

	const user = await UserData.findOne({
		email: req.body.email,
	})
	if (!user) {
		console.log('no user')
		return { status: 'error', error: 'Invalid Email' }

	}
	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})


module.exports = router;

// async function register(){
//     try {
//         const newPassword = await bcrypt.hash("", 10)
//         await UserData.create({
//             name: "Vivek",
//             email: "newexpressnz@gmail.com",
//             password: newPassword,
//             CreatedDate: new Date()
//         })
//         console.log("User created")
//         } catch (err) {
//             console.log("err" + err)
//         }
// }