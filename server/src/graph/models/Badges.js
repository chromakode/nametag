const {db} = require('../../db')
const errors = require('../../errors')
const notification = require('../../notifications')

const badgesTable = db.table('badges')

/**
 * Returns a badge from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => badgesTable.get(id).run(conn)

/**
 * Returns an array of badges from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   the ids of the badges to be retrieved
 *
 */

const getAll = ({conn}, ids) => badgesTable.getAll(...ids).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Returns an array of badges from a template id.
 *
 * @param {Object} context     graph context
 * @param {String} templateId   the id of the badge tempalte
 *
 */

const getTemplateBadges = ({conn}, template) => badgesTable.getAll(template, {index: 'template'}).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Creates a badge
 *
 * @param {Object} context     graph context
 * @param {Object} badge   the badge to be created
 *
 **/

const create = ({conn, models: {Users, Nametags, Templates}}, {note, template, defaultNametag}) => {
  const firstNote = {
    text: note,
    date: new Date()
  }
  const badgeObj = {createdAt: new Date(), template, notes: [firstNote], defaultNametag}
  return badgesTable.insert(badgeObj).run(conn)
  // Append badge ID to user object
  .then(res => {
    if (res.errors > 0) {
      return new Error(res.error)
    }
    const id = res.generated_keys[0]
    return Promise.all([
      id,
      Users.addBadge(id, template, defaultNametag),
      Nametags.grantBadge(defaultNametag, id),
      Users.getTokens(defaultNametag),
      db.table('templates').getAll(template)
        .eqJoin('granter', db.table('granters'))
        .map((join) => ({template: join('left'), granter: join('right')}))
        .nth(0)
        .run(conn)
    ])
  })
  .then(([id, userRes, nametagRes, [token], {template, granter}]) => {
    if (userRes.errors > 0) {
      return new errors.APIError(`Error appending badge ID to user: ${userRes.first_error}`)
    }
    if (nametagRes.errors > 0) {
      return new errors.APIError(`Error granting badge to Nametag: ${nametagRes.first_error}`)
    }
    return notification({
      reason: 'BADGE_GRANTED',
      params: {
        badgeName: template.name,
        granterName: granter.name,
        image: template.image
      }
    }, token)
    .then(() => Object.assign({}, badgeObj, {id}))
  })
}

/**
 * Adds a note to a badge
 *
 * @param {Object} context     graph context
 * @param {String} badgeId   the id of the badge to which the note should be added
 * @param {String} note   the text of the note
 *
 **/

const addNote = ({conn}, badgeId, text) =>
  badgesTable.get(badgeId).update(badge => Object.assign(
    {},
    badge,
    {
      notes: badge('notes').prepend({
        text,
        date: new Date()
      })
    }
  )).run(conn)

module.exports = (context) => ({
  Badges: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    getTemplateBadges: (templateId) => getTemplateBadges(context, templateId),
    create: (badgeInput) => create(context, badgeInput),
    addNote: (badgeId, text) => addNote(context, badgeId, text)
  }
})
