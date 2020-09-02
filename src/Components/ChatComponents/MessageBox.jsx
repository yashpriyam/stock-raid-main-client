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
      <span>{connectedTo || "Not chatting with anyone currently"}</span>
      <div>
        {!!connectedTo && messages[connectedTo] ? (
          <div>
            {messages[connectedTo].map(
              ({ name: sender, message: text, time }) => (
                <div key={`msg-${name}-${time}`}>
                  <span>{sender === name ? "You" : sender}</span>
                  <div>
                    <span>{formatRelative(new Date(time), new Date())}</span>
                  </div>
                  <span>{text}</span>
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
