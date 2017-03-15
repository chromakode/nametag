const _ = require('lodash')
const Messages = require('./Messages')
const Nametags = require('./Nametags')
const Rooms = require('./Rooms')
const Badges = require('./Badges')

module.exports = (context) => {

  // We need to return an object to be accessed.
  return _.merge(...[
    Messages,
    Nametags,
    Rooms,
    Badges
  ].map((loaders) => {
    // Each loader is a function which takes the context.
    return loaders(context)
  }))
}
