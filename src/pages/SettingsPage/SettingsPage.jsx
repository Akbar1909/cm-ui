import { useState, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Tabs, Tab, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import TicketSideTable from './_components/TicketSideTable';
import TicketModuleTable from './_components/TicketModuleTable';
import ClientStatusTable from './_components/ClientStatusTable';
import MyButton from 'components/MyButton';
import PageContentWrapper from 'components/PageContentWrapper';
import UserRoleTable from './_components/UserRoleTable';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <Box
      py={3}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}>
      {value === index && <Card>{children}</Card>}
    </Box>
  );
}

const initialSelectedAction = {
  action: 'idle',
  id: null
};

const SettingsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [_, startTransition] = useTransition();
  const [value, setValue] = useState(() => parseInt(searchParams.get('tab'), 10) || 0);
  const [selectedAction, setSelectedAction] = useState(initialSelectedAction);

  const handleChange = (_, newValue) => {
    setSelectedAction(initialSelectedAction);
    startTransition(() => {
      setValue(newValue);
      searchParams.set('tab', newValue);
      setSearchParams(searchParams);
    });
  };

  const tabProps = {
    selectedAction,
    setSelectedAction
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    setSelectedAction((prev) => ({ ...prev, action: 'create' }));
  };

  return (
    <PageContentWrapper>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={t('Side')} {...a11yProps(0)} />
          <Tab label={t('Module')} {...a11yProps(1)} />
          <Tab label={t('Client Status')} {...a11yProps(1)} />
          <Tab label={t('Employee Role')} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Box pt="24px" display="flex" justifyContent="flex-end">
        <MyButton startIcon={<AddIcon />} variant="contained" onClick={handleAdd}>
          {t('Add')}
        </MyButton>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TicketSideTable {...tabProps} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TicketModuleTable {...tabProps} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ClientStatusTable {...tabProps} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <UserRoleTable {...tabProps} />
      </CustomTabPanel>
    </PageContentWrapper>
  );
};

export default SettingsPage;
