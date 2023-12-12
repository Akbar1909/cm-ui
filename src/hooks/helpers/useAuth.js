import useAuthStore from 'clientStore/useAuthStore';

const useAuth = () => {
  return useAuthStore((state) => state.isAuth);
};

export default useAuth;
