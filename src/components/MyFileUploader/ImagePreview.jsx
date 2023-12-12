import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

export default function ImagePreview({ open, url, handleClose, download }) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{t('Image')}</DialogTitle>
      <DialogContent>
        {/* <embed src={url} type="application/pdf" width="100%" height="600px" /> */}
        <img src={url} style={{ width: '400px', height: '400px', objectFit: 'cover' }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('Close')}</Button>
        <Button onClick={download} autoFocus>
          {t('Download')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
