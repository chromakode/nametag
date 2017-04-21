const UsersLoader = require('../graph/models/Users')
const Context = require('../graph/context')

const Users = conn =>
  UsersLoader(new Context({}, conn)).Users

module.exports = (req, res, next, conn) => (err, data) => {
  if (err) {
    next(err)
    return
  }
  const {user, authProfile} = data
  const reqWithUser = Object.assign({}, req, {user})
  return Promise.all([
        Users(reqWithUser, conn).addDefaultsFromAuth(authProfile),
        Users(reqWithUser, conn).addBadgesFromAuth(authProfile),
      ]).then(() => {
        req.login(user, (err) => {
          if (err) {
            return next(err)
          }
          res.redirect('/')
        })
      }).catch(next)
}
