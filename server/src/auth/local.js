const UsersLoader = require('../graph/models/Users')
const LocalStrategy = require('passport-local').Strategy
const {ErrBadAuth} = require('../errors')
const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  (req, email, password, done) => {
    req.user
    ? Users(conn).addEmail(req.user.id, email)
      .then(() => done(null, Object.assign({}, req.user, {email})))
    : Users(conn).getByEmail(email)
      .then(user => {
        if (!user) {
          return done(null, false, ErrBadAuth)
        }
        return Promise.all([Users(conn).validPassword(user.id, password), user])
      })
      .then(([valid, user]) => {
        if (!valid) {
          return done(null, false, ErrBadAuth)
        }
        return done(null, user)
      })
      .catch(done)
  }
)

module.exports.handleLocalCallback = (req, res, next) => (err, user) => {
  if (err) {
    return next(err)
  }

  if (!user) {
    return next(ErrBadAuth)
  }
  // Perform the login of the user!
  req.login(user, (err) => {
    if (err) {
      return next(err)
    }
    // We logged in the user! Let's send back the user id.
    res.json({id: user.id})
  })
}

module.exports.register = conn => (req, res, next) => {
  const {email, password} = req.body
  if (!email || !password) {
    next(ErrBadAuth)
  }
  Users(conn).createLocal(email, password)
    .then((id) => {
      res.json({id})
    })
    .catch(err => next(err))
}
