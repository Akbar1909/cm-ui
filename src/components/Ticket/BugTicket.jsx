import { useState } from 'react';
import { Box, Typography, Stack, Popover, MenuItem, IconButton } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorageIcon from '@mui/icons-material/Storage';
import LaptopIcon from '@mui/icons-material/Laptop';
import InfoIcon from '@mui/icons-material/Info';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useTranslation } from 'react-i18next';
import styles from './Ticket.styles';
import MyTooltip from 'components/MyTooltip';
import TicketHeader from './TicketHeader';
import { joinArray } from 'utils/helpers';
import ListIcon from '@mui/icons-material/List';
import TicketContent from './TicketContent';

const { bug: bugStyles } = styles;

const BugTicket = ({ ticket, sx }) => {
  const {
    status: type,
    operator,
    side,
    regDate,
    developer,
    description,
    name,
    bugFixDate
  } = ticket;
  const { t } = useTranslation();

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <Stack sx={[styles.baseRoot, bugStyles.root, ...(Array.isArray(sx) ? sx : [sx])]}>
        <TicketHeader type={type} name={name} id={ticket.id} />
        <TicketContent description={description} />
        <Stack columnGap={'4px'} direction="row" alignItems="center" sx={styles.baseFooter}>
          <IconButton sx={{ p: 0 }}>
            <ListIcon
              fontSize="large"
              onClick={handleOpenMenu}
              sx={{
                color: (theme) => theme.palette.primary.main,
                cursor: 'pointer'
              }}
            />
          </IconButton>

          <Stack ml="auto" direction="row" alignItems="center">
            <MyTooltip title={t('Reg date')}>
              <InfoIcon sx={styles.footerItem.svg} />
            </MyTooltip>
            <Typography variant="caption" children={regDate} />
          </Stack>

          <Stack direction="row" alignItems="center" ml="auto">
            <MyTooltip title={t('Bug fix date')}>
              <CheckCircleIcon sx={styles.footerItem.svg} />
            </MyTooltip>
            <Typography variant="caption" children={bugFixDate} />
          </Stack>
        </Stack>
      </Stack>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: styles.popoverMenu
        }}>
        <MenuItem>
          {side === 'server_side' ? (
            <MyTooltip title={t('Server side bug')}>
              <StorageIcon />
            </MyTooltip>
          ) : (
            <MyTooltip title={t('Client side bug')}>
              <LaptopIcon />
            </MyTooltip>
          )}
          <Typography
            component="p"
            children={side === 'server_side' ? t('Server side') : 'Client side'}
          />
        </MenuItem>
        <MenuItem
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
          <ManageAccountsIcon />
          <Typography
            component="p"
            children={joinArray([developer?.firstName, developer?.lastName])}
          />
        </MenuItem>
        <MenuItem
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
          <SupportAgentIcon />
          <Typography
            component="p"
            children={joinArray([operator?.firstName, operator?.lastName])}
          />
        </MenuItem>
      </Popover>
    </>
  );
};

export default BugTicket;
