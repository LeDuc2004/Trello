import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();
const API_DATA_NODEJS = process.env.REACT_APP_API_NODEJS;


const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`${API_DATA_NODEJS}`);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
