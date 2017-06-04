jest.mock('rethinkdb', () => {console.log('rethinkdb mock')})
jest.mock('uuid', () => {console.log('uuid mock')})
jest.mock('aws-sdk', () => {console.log('aws-sdk mock'); return {S3: jest.fn()}})
jest.mock('crypto-js', () => ({enc: jest.fn(), SHA3: jest.fn()}))
jest.mock('../../../db', () => ({db:{table: jest.fn()}}))
jest.dontMock('../Users')

const mockRdb = require('../../../../../tests/mockRdb')
const UserModel = require('../Users')

const makeCursor = objects => ({
  toArray: () => objects
})

describe('User loader', () => {
  let Users
  beforeEach(() => {
    Users = UserModel({conn: 'mockConnection'}).Users
  })
  describe('findOrCreateFromAuth', () => {
    // Mocks not working as advertised, timeboxing for now
    it('should return a user if one already exists', () => {
      let calls = []
      let mockProfile = {
        displayName: 'Stampisaur',
        photos: [{value: 'http://profile.photo.com'}],
        id: '12345'
      }
      // r.mockReturnValueOnce(mockRdb(makeCursor([{id: '456', displayNames: ['Stampi']}]), calls)())
      return Users.findOrCreateFromAuth(mockProfile, 'facebook')
        .then(user => {
          expect(user.displayNames[0]).toEqual('Stampi')
        })
    })

    it('should create a user if one does not exist', () => {

    })
  })
})
