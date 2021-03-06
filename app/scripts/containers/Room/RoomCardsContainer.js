import { connect } from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/RoomCards'
import {roomsQuery} from '../../graph/queries'
import {createNametag, passwordResetRequest} from '../../graph/mutations'
import {registerUser, loginUser} from '../../actions/UserActions'
import {updateNametagEdit, addNametagEditBadge, removeNametagEditBadge} from '../../actions/NametagEditActions'

const mapStateToProps = (state) => {
  return {
    nametagEdits: state.nametagEdits
  }
}

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    updateNametagEdit: disp(updateNametagEdit),
    addNametagEditBadge: disp(addNametagEditBadge),
    removeNametagEditBadge: disp(removeNametagEditBadge),
    registerUser: disp(registerUser),
    loginUser: disp(loginUser)
  }
}

const RoomCards = compose(
  connect(mapStateToProps, mapDispatchToProps),
  createNametag,
  passwordResetRequest,
  roomsQuery
)(component)

export default RoomCards
