import React from 'react';
import './MessageBox.css';
import { useMessage } from '../context/MessageContext';

const MessageBox = () => {
  const { message, messageType, closeMessage } = useMessage();

  if (!message) return null;

  return (
    <div className={`message-box ${messageType}`}>
      <p>{message}</p>
      <button onClick={closeMessage}>OK</button>
    </div>
  );
};

export default MessageBox;
