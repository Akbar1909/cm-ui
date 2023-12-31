import PropTypes from 'prop-types';
import { useMemo } from 'react';
// @mui
import { CssBaseline } from '@mui/material';
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  StyledEngineProvider
} from '@mui/material/styles';
import GlobalStyles from './globalStyles';

//
import getPalette from './palette';
import shadows from './shadows';
import typography from './typography';
import customShadows from './customShadows';
import componentsOverride from './overrides';
import useThemeStore from 'clientStore/useThemeStore';

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node
};

export default function ThemeProvider({ children }) {
  const { mode } = useThemeStore();

  const themeOptions = useMemo(() => {
    const palette = getPalette(mode);

    return {
      palette,
      shape: { borderRadius: 6 },
      typography,
      shadows: shadows(palette),
      customShadows: customShadows(palette)
    };
  }, [mode]);

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
