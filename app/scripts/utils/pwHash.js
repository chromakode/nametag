import {enc, SHA3} from 'crypto-js'

export default (password) => {
  let hashedPassword = SHA3(password, {outputLength: 224})
  return hashedPassword.toString(enc.Base64)
}
