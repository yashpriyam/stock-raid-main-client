import React from "react"
import { formatRelative } from "date-fns"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import FormInput from '../../helpers/form-input/form-input.component';

const MessageBox = ({
  messages,
  connectedTo,
  message,
  setMessage,
  sendMsg,
  name,
}) => {
  return (
      <div>
        {!!connectedTo && messages[connectedTo] ? (
          <div className='msg-box-container'>
            {messages[connectedTo].map(
              ({ name: sender, message: text, time }) => (
                <div key={`msg-${name}-${time}`} className={sender === name ? 'current-user' : 'other-user'}>
                  {/* <span>{sender === name ? "You" : sender}</span> */}
                  <div >
                    <span className='msg-timestamp'>{formatRelative(new Date(time), new Date())}</span>
                  </div>
                  <div className='msg-text'><span >{text}</span></div>
                </div>
              )
            )}
          </div>
        ) : (
          <div>
            <span name="discussions" />
            No messages available yet
          </div>
        )}
        <div className='message-box-button'>
          <FormInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message"
          />
          <CustomButton color="teal" disabled={!message} onClick={sendMsg}>
            <span>Send Message</span>
          </CustomButton>
        </div>
      </div>
  )
}

// MessageBox.propTypes = {
//   params: React.PropTypes.any,
// };
export default MessageBox
