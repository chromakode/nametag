const r = require('rethinkdb')

let db
let init

switch (process.env.NODE_ENV) {
  case 'test':
    db = r.db('test')
    init = (conn) => r.branch(r.dbList().contains('test'), r.dbDrop('test'), null).run(conn)
    .then(() => r.dbCreate('test').run(conn))
    break
  default:
    db = r.db('nametag')
    init = (conn) => r.dbCreate('nametag').run(conn).catch(err => null)
}

module.exports.db = db
module.exports.dbInit = init