import useUserStore from 'clientStore/useUserStore';
import USER_ROLES from 'data/user/user.constants';

const useUser = () => {
  return useUserStore((state) => ({
    ...state.user,
    displayName: `${state.user?.firstName} ${state.user?.lastName}`,
    isClient: state.user?.role?.name === USER_ROLES.CLIENT
  }));
};

export default useUser;
