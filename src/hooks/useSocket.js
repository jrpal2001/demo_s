import { useEffect } from 'react';
import socket from '../socket';

const useSocket = () => {
  useEffect(() => {
    // Example: log when connected/disconnected
    socket.on('connect', () => {
      console.log('Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    // Clean up listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return socket;
};

export default useSocket;
