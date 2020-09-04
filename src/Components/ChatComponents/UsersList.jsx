import React from "react"
// import CustomButton from '../../helpers/custom-button/custom-button.component';
import './chat.styles.scss';

const UsersList = ({ users, toggleConnection, connectedTo, connecting }) => {
  return (
    <div className='chat-panel'>
      <span className='chat-header'>Online Users</span>
      <div>
        {(users.length && (
          <div>
            {users.map(({ userName }) => (
              <div
                key={userName}
                onClick={() => {
                  toggleConnection(userName)
                }}
                disabled={!!connectedTo && connectedTo !== userName}
                loading={connectedTo === userName ? connecting : undefined}
                className='user-button'
              >
                {userName.toUpperCase()} <div className='online'></div>
              </div>
            ))}
          </div>
        )) || <span>There are no users Online</span>}
      </div>
    </div>
  )
}

// UsersList.propTypes = {
//   params: React.PropTypes.any,
// };
export default UsersList
