import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { computed } from 'zustand-middleware-computed-state';

const useThemeStore = create(
  computed(
    persist(
      (set) => ({
        mode: 'light',
        setTheme: (mode) => {
          set({ mode });
        }
      }),
      {
        name: 'themeStore',
        storage: createJSONStorage(() => localStorage)
      }
    ),
    (state) => ({
      ...state,
      isLightMode: state.mode === 'light',
      isDarkMode: state.mode === 'dark'
    })
  )
);

export default useThemeStore;
