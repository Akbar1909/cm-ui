// ----------------------------------------------------------------------

import useThemeStore from 'clientStore/useThemeStore';

export default function Tooltip(theme) {
  const { palette } = theme;
  const { isDarkMode } = useThemeStore.getState();

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: isDarkMode ? palette.grey[100] : palette.grey[800],
          color: palette.common.white
        },
        arrow: {
          color: palette.grey[800]
        }
      }
    }
  };
}
