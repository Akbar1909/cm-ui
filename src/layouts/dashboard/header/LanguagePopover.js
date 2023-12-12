import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Popover, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

// ----------------------------------------------------------------------

const LANGS = {
  en: {
    value: 'en',
    label: 'En',
    icon: '/assets/icons/ic_flag_en.svg'
  }
};

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem('i18nextLng') || 'en');

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleClick = (e) => {
    const { index = '' } = e.target.dataset;

    if (!index) {
      return;
    }
    localStorage.setItem('i18nextLng', index);
    setLang(index);
    i18n.changeLanguage(index);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 30,
          height: 30,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}>
        <IconButton>
          <LanguageIcon sx={{ fill: (theme) => theme.palette.primary.main }} />
        </IconButton>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}>
        <Stack spacing={0.75} onClick={handleClick}>
          {Object.values(LANGS).map((option) => (
            <MenuItem data-index={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </>
  );
}
