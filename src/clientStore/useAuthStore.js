import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { computed } from 'zustand-middleware-computed-state';

const useAuthStore = create(
  computed(
    persist(
      (set) => ({
        accessToken: null,
        refreshToken: null,
        setAccessToken: (accessToken) => {
          set({
            accessToken
          });
        },
        setRefreshToken: (refreshToken) => {
          set({ refreshToken });
        },
        clearAccessToken: () => {
          set({ accessToken: null });
        }
      }),
      {
        name: 'authStore',
        storage: createJSONStorage(() => localStorage)
      }
    ),
    (state) => {
      return {
        isAuth: Boolean(state.accessToken)
      };
    }
  )
);

export default useAuthStore;
