const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

router.post('/register', async (req, res, next) => {
    try {
      const userId = uuidv4();
      const userData = req.body;
      const hashedPassword = await bcrypt.hash(userData.password, 10)
  
      const existEmail = await req.db('users').where('email', userData.email).first()
      if (existEmail) {
        res.status(404).send({ Error: 'Email is already in use. '})
      }
        await req.db('users').insert({
        userid: userId,
        username: userData.name, 
        email: userData.email,
        password: hashedPassword
       });
        console.log('User data inserted successfully');
        alert(`Dear ${userData.name}, your registration is succesful, you can now log-in`)
        res.redirect('http://localhost:5500/html/login.html');
        // sessionStorage.setItem('uuid', userId);
    } catch (error) {
      console.error('Error inserting user data:', error);
      res.status(500).send('Error inserting user data');
    }
  });

router.use(cookieParser());
router.post('/login', async (req, res) => {
  const userData = req.body;

  try {

    const user = await req.db('users').where('email', userData.email).first();
    console.log(userData.email)
    if (!user) {
      return res.status(404).send({ message: 'User does not exist please sign up' });
    }

    if (await bcrypt.compare(userData.password, user.password)) {
      console.log('Login Successful');
      const userId = user.userid
      const username = user.username;
      res.cookie('userId', userId, {secure: false});
      res.cookie("username", username, { secure: false });
      console.log(userId, username)
      return res.redirect('http://localhost:5500/html/home.html');
    } else {
      return res.status(401).send('Invalid Password');
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Login failed');
  }
});

router.get('/logout', (req, res) => {
  try {
    res.clearCookie('userId');

    res.redirect('http://localhost:5500/html/login.html');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Logout failed');
  }
});



module.exports = router;
