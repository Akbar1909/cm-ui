import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { computed } from 'zustand-middleware-computed-state';

const useUserStore = create(
  computed(
    persist(
      (set) => ({
        user: null,
        project: null,
        setUser: (user) => {
          set({ user });
        },
        setProject: (project) => {
          set({ project });
        }
      }),
      {
        name: 'userStore',
        storage: createJSONStorage(() => localStorage)
      }
    ),
    (state) => {
      const { user } = state;
      return {
        user,
        project: state.project,
        hasAccessToClientRelatedActions:
          user?.role.name === 'manager' ||
          user?.role.name === 'sales' ||
          user?.role.name == 'support'
      };
    }
  )
);

export default useUserStore;
