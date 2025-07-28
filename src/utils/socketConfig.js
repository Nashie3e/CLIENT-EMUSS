import io from 'socket.io-client';

// Socket.io server URL
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://ticketing.depedimuscity.com:5000';

/**
 * Creates a configured Socket.io client instance
 * @param {Object} options - Additional Socket.io options
 * @returns {Object} Socket.io client instance
 */
export const createSocketConnection = (options = {}) => {
  return io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    ...options
  });
};

/**
 * Authenticate socket connection with admin token
 * @param {Object} socket - Socket.io client instance
 * @returns {void}
 */
export const authenticateSocket = (socket) => {
  const token = localStorage.getItem('token');
  // Check if the user is stored in localStorage
  const userStr = localStorage.getItem('user');
  let user;
  
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Error parsing user data:', e);
    user = null;
  }
  
  if (token && socket) {
    // Log authentication attempt with role information
    console.log('Socket authentication attempt:', { 
      hasToken: !!token,
      userRole: user?.role,
      isUserAdmin: user?.role === 'ADMIN',
      isUserStaff: user?.role === 'STAFF'
    });
    
    // Send token as string (the way JWT expects it)
    socket.emit('authenticate', token);
    
    // Also send role info in a separate event
    socket.emit('userRole', {
      role: user?.role || 'UNKNOWN'
    });
    
    console.log('Socket authentication sent');
  }
};

const socketConfig = {
  SOCKET_URL,
  createSocketConnection,
  authenticateSocket
};

export default socketConfig; 