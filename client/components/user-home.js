import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Chat from './chat'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div id="main">
      <h3>Welcome, {email}</h3>
      <Chat />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
