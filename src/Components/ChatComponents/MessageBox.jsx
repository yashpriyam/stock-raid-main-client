import React from "react";
import { formatRelative } from "date-fns";
const MessageBox = ({ messages, connectedTo, message, setMessage, sendMsg, name }) => {
  return (
        <div >
          <span>{!!connectedTo ? connectedTo : "Not chatting with anyone currently"}</span>
          <div>
            {!!connectedTo && messages[connectedTo] ? (
              <div>
                {messages[connectedTo].map(({ name: sender, message: text, time }) => (
                  <div key={`msg-${name}-${time}`}>
                      <span>{sender === name ? 'You' : sender}</span>
                      <div>
                        <span>
                          {formatRelative(new Date(time), new Date())}
                        </span>
                      </div>
                      <span>{text}</span>
                    </div>
                ))}
              </div>
            ) : (
                <div>
                  <span name="discussions" />
                  No messages available yet
                </div>
            )}
              <input 
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type message"
              />
              <button color="teal" disabled={!message} onClick={sendMsg}>
                <span>
                Send Message
                </span>
              </button>
          </div>
        </div>
  );
};

// MessageBox.propTypes = {
//   params: React.PropTypes.any,
// };
export default MessageBox;