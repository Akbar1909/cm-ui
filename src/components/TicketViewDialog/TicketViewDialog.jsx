import DialogContent from '@mui/material/DialogContent';
import TicketView from './TicketView';
import MyModal from 'components/MyModal';

function TicketViewDialog({ open, handleClose, id }) {
  return (
    <MyModal
      rootSx={{ width: '100%' }}
      open={open}
      actionLoading={false}
      bodySx={{
        width: '800px',
        height: 'auto',
        backgroundColor: (theme) => theme.palette.background.default
      }}
      handleClose={handleClose}
      confirmationSx={{ width: '100%', p: 0 }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogContent sx={{ p: 0, width: '100%' }}>
        <TicketView id={id} />
      </DialogContent>
    </MyModal>
  );
}

export default TicketViewDialog;
