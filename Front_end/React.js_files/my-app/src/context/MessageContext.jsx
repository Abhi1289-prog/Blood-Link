import React, { createContext, useContext, useState, useCallback } from 'react';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const showMessage = useCallback((text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const closeMessage = useCallback(() => {
    setMessage('');
    setMessageType('info');
  }, []);

  return (
    <MessageContext.Provider value={{ message, messageType, showMessage, closeMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error('useMessage must be used within MessageProvider');
  return ctx;
};

export default MessageContext;
