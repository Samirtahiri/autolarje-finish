// Simple static authentication system

const AUTH_KEY = 'cw.auth';

// Default credentials (you can change these)
const DEFAULT_CREDENTIALS = {
  username: 'finish',
  password: '1119'
};

export const login = (username, password) => {
  // Check against default credentials
  if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
    const authData = {
      isAuthenticated: true,
      username: username,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return { success: true, message: 'Login successful' };
  }
  
  return { success: false, message: 'Invalid username or password' };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  return { success: true, message: 'Logged out successfully' };
};

export const checkAuth = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.isAuthenticated === true;
    }
  } catch (error) {
    console.error('Error checking auth:', error);
  }
  return false;
};

export const getCurrentUser = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.isAuthenticated ? parsed.username : null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
};

export const isAuthenticated = () => {
  return checkAuth();
};
