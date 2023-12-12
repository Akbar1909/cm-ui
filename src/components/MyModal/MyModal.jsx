import React from 'react';
import { Modal, Box, Stack } from '@mui/material';
import styles from './MyModal.styles';
import MyButton from 'components/MyButton';
import useThemeStore from 'clientStore/useThemeStore';

const MyModal = ({
  type = 'confirmation',
  rootSx,
  open,
  handleClose,
  bodySx,
  children,
  withActionButtons = false,
  cancel = 'Cancel',
  handleCancel = () => {},
  ok,
  handleOk = () => {},
  actionLoading = true,
  confirmationSx,
  okProps,
  cancelProps
}) => {
  const { mode } = useThemeStore();
  return (
    <Modal
      open={open}
      onClose={!actionLoading && handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={[
        mode === 'dark' && {
          '& .MuiBackdrop-root': { backgroundColor: 'black', opacity: '0.3 !important' }
        },
        Array.isArray(rootSx) ? rootSx : [rootSx]
      ]}>
      <Stack
        sx={[
          styles.body,
          type === 'confirmation' && styles.confirmation,
          { boxShadow: 'none' },
          ...(Array.isArray(bodySx) ? bodySx : [bodySx])
        ]}>
        <Box
          mb={'20px'}
          sx={[
            styles.confirmation,
            type === 'confirmation' && styles.confirmationContent,
            ...(Array.isArray(confirmationSx) ? confirmationSx : [confirmationSx])
          ]}
          width="100%"
          flex={1}>
          {children}
        </Box>
        {withActionButtons && (
          <Stack
            display="flex"
            alignItems="center"
            justifyContent="center"
            columnGap={'4px'}
            direction="row"
            marginTop="auto">
            <MyButton
              sx={{ minWidth: '120px' }}
              disabled={actionLoading}
              onClick={handleCancel}
              {...cancelProps}>
              {cancel}
            </MyButton>
            <MyButton
              sx={{ minWidth: '120px' }}
              onClick={handleOk}
              variant="contained"
              loading={actionLoading}
              {...okProps}>
              {ok}
            </MyButton>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};

export default MyModal;
