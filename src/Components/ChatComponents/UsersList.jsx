import React from "react"
import CustomButton from '../../helpers/custom-button/custom-button.component';

const UsersList = ({ users, toggleConnection, connectedTo, connecting }) => {
  return (
    <div>
      <span>Online Users</span>
      <div>
        {(users.length && (
          <div>
            {users.map(({ userName }) => (
              <div key={userName}>
                <div>
                  <CustomButton
                    onClick={() => {
                      toggleConnection(userName)
                    }}
                    disabled={!!connectedTo && connectedTo !== userName}
                    loading={connectedTo === userName ? connecting : undefined}
                  >
                    {connectedTo === userName ? "Disconnect" : "Connect"}
                  </CustomButton>
                </div>
                <div className='connected-user-name'>
                  <span>{userName}</span>
                </div>
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
