const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

module.exports = {
  signup,
  login,
  show,
  getUsers,
  forgotPassword,
  updatePassword,
  follow,
  unfollow,
  favorite,
  unfavorite
};

function createJWT(user) {
  return jwt.sign(
    {user},
    process.env.SECRET,
    {expiresIn: '24h'}
  );
}

async function signup(req, res) {
  try {
    const user = new User(req.body);
    try {
      await user.save(function (err) {
        if (err) {return res.status(500).json({err: 'Error: Database error'})}
      });
      const token = createJWT(user);
      res.json({ token });
    } catch (err) {
      res.status(400).json(err);
    }
  } catch (err) {
    console.log(err, '<-- error')
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(401).json({err: 'Error: Bad credentials'});
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        const token = createJWT(user);
        res.json({token});
      } else {
        return res.status(401).json({err: 'Error: Bad credentials'});
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
}

function show(req, res) {
  User.findById(req.params.id)
  .populate('following')
  .populate('followers')
  .then(user => res.json(user));
}

function getUsers(req, res) {
  User.find({})
  .then(users => res.json(users))
}

function forgotPassword(req, res) {
  const googleEmail = process.env.GOOGLE_APP_EMAIL
  const googlePass = process.env.GOOGLE_APP_PW
  if(process.env.GOOGLE_APP_EMAIL && process.env.GOOGLE_APP_PW) {
    const email = req.body.email
    User.findOne({email}, (err, user) => {
      if (err || !user) {
        return res.status(400).json({error: 'User with this email does not exist'})
      }
      
      const token = jwt.sign({_id: user._id}, process.env.RESET_PASSWORD_KEY, {expiresIn: '15m'})
  
      let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: googleEmail,
                pass: googlePass
            },
      });
      
      const data = {
        to: email,
        subject: 'Reset Account Password Link',
        html: `
        <h3>Please click the link below to reset your password</h3>
        <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
        `,
      }
      
      return user.updateOne({resetLink: token}, (err, user) => {
        if (err) {
          return res.status(400).json({error: 'Reset password link error'})
        } else {
          transporter.sendMail(data, function(error, body) {
            if (error) {
              return res.status(400).json({error: error.message})
            }
            return res.status(200).json({message: 'Email has been sent, please follow the instructions'})
          })
        }
      })
    })
  } else{
    return res.status(400).json({error: 'You have not set up an account to send an email or a reset password key for jwt'})
  }
}

function updatePassword(req, res) {
  const {token, password} = req.body
  if (token) {
    jwt.verify(token, process.env.RESET_PASSWORD_KEY, function(error, decodedData) {
      if (error) {
        return res.status(400).json({error: 'Incorrect token or it is expired'})
      }
      User.findOne({resetLink: token}, (err, user) => {
        if (err || !user) {
          return res.status(400).json({error: 'User with this token does not exist'})
        }
      
        user.password = password
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({error: 'Reset Password Error'})
          } else {
            return res.status(200).json({message:'Your password has been changed'})
          }
        })
      })
    })
  } else {
    return res.status(401).json({error: "Authentication Error"})
  }
}

function follow(req, res) {
  User.findById(req.user._id)
  .then(user => {
    user.following.push(req.params.following)
    user.save()
  })

  User.findById(req.params.following)
  .then(user => {
    user.followers.push(req.user._id)
    user.save()
    return res.json(user)
  })
}

function unfollow(req, res) {
  User.findById(req.user._id)
  .then(user => {
    user.following = user.following.filter(val => JSON.stringify(val) !== JSON.stringify(req.params.unfollowing))
    user.save()
  })
  
  User.findById(req.params.unfollowing)
  .then(user => {
    user.followers = user.followers.filter(val => JSON.stringify(val) !== JSON.stringify(req.user._id))
    user.save()
    return res.json(user)
  })
}

function favorite(req, res) {
  User.findById(req.user._id)
  .then(user => {
    user.favorites.push(req.params.placeId)
    user.save()
    return res.json(user)
  })
}

function unfavorite(req, res) {
  User.findById(req.user._id)
  .then(user => {
    user.favorites = user.favorites.filter(val => val !== req.params.placeId)
    user.save()
    return res.json(user)
  })
}