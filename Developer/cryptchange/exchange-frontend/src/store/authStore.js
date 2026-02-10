import { create } from 'zustand';
import { authAPI } from '../services/api';

/**
 * 认证状态管理
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,

  // 注册
  register: async (email, username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({ email, username, password });
      const { token, refreshToken, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        user,
        token,
        refreshToken,
        isLoading: false
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // 登录
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { token, refreshToken, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        user,
        token,
        refreshToken,
        isLoading: false
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      token: null,
      refreshToken: null,
      error: null
    });
  },

  // 检查是否登录
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // 获取当前用户
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    set({ isLoading: true });
    try {
      const response = await authAPI.me();
      set({ user: response.data.data, isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ isLoading: false });
      return null;
    }
  }
}));

export default useAuthStore;
