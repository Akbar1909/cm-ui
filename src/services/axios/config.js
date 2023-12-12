import axios from 'axios';
import useAuthStore from 'clientStore/useAuthStore';

const request = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true
});

// Add a request interceptor
request.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    const { accessToken } = useAuthStore.getState();

    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
request.interceptors.response.use(
  async function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response;
  },
  async function (error) {
    const { refreshToken, setAccessToken, setRefreshToken } = useAuthStore.getState();

    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        const { data } = await axios({
          method: 'POST',
          // eslint-disable-next-line no-undef
          baseURL: process.env.REACT_APP_BASE_URL,
          url: '/auth/refresh',
          headers: { refresh_token: refreshToken }
        });
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
      } catch (e) {
        localStorage.removeItem('authStore');
        window.location.pathname = '/';
      }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default request;
