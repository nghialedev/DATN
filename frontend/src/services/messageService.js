import api from './api';
import io from 'socket.io-client';

const API_URL = 'http://localhost:3000';
let socket = null;

const MessageService = {
  connectSocket: () => {
    const token = localStorage.getItem('token');
    if (!socket && token) {
      socket = io(API_URL, {
        auth: {
          token
        }
      });
    }
    return socket;
  },

  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  listenForMessages: (callback) => {
    const socket = MessageService.connectSocket();
    if (socket) {
      socket.on('message', (message) => {
        callback(message);
      });
    }
  },

  sendMessage: (message) => {
    const socket = MessageService.connectSocket();
    if (socket) {
      socket.emit('sendMessage', message);
    }
  },

  getAllMessages: async () => {
    try {
      return await api.get('/message');
    } catch (error) {
      throw error;
    }
  },

  getMessageById: async (id) => {
    try {
      return await api.get(`/message/${id}`);
    } catch (error) {
      throw error;
    }
  },

  createMessage: async (messageData) => {
    try {
      return await api.post('/message', messageData);
    } catch (error) {
      throw error;
    }
  },

  markMessageAsRead: async (id) => {
    try {
      return await api.patch(`/message/${id}`, { seen: true });
    } catch (error) {
      throw error;
    }
  },

  deleteMessage: async (id) => {
    try {
      return await api.delete(`/message/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default MessageService; 