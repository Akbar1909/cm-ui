import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import { TableRow, TableCell, IconButton, Box } from '@mui/material';
import get from 'lodash.get';
import MyTable from 'components/MyTable';
import { useTranslation } from 'react-i18next';
import MyModal from 'components/MyModal';
import { useNavigate } from 'react-router-dom';
import notification from 'services/notification';
import TableFilterProvider, { TableFilterContext } from 'contexts/TableFilterContext';
import DeleteConfirmation from 'components/DeleteConfirmation';
import PageHeader from 'components/PageHeader';
import PageContentWrapper from 'components/PageContentWrapper';
import useTable from 'hooks/useTable';
import { httpDeleteOrganization, httpGetOrganizations } from 'data/organization';
import { makeItMap } from 'utils/helpers';
import CreateOrganizationForm from './_components/CreateOrganizationForm';
import EditOrganizationForm from './_components/EditOrganizationForm';
import useUserStore from 'clientStore/useUserStore';
import ContentWrapper from 'components/ContentWrapper';
import PlusButton from 'components/PlusButton';
import { faEllipsisVertical, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import MyMenu from 'components/MyMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function OrganizationsPage() {
  return (
    <TableFilterProvider
      value={{
        search: {
          headerSearch: false,
          type: 'search',
          value: '',
          touched: false
        }
      }}>
      <OrganizationList />
    </TableFilterProvider>
  );
}

function OrganizationList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasAccessToClientRelatedActions } = useUserStore();
  const { query, ...context } = useContext(TableFilterContext);

  const {
    tableState: { page, size },
    handleSizeChange,
    setDynamicValues
  } = useTable({ search: '', page: 1, size: 10 });

  const [actionType, setActionType] = useState('view');
  const [open, setOpen] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const params = {
    ...query,
    page,
    size
  };

  const handlePageChange = (t, page) => {
    setDynamicValues({ page });
  };

  const TABLE_HEAD = [
    { id: 'number', label: '', align: 'center', width: '2%' },
    { id: 'organizationName', width: '46%', label: t('Organization Name'), align: 'left' },
    { id: '', width: '2%' }
  ];

  const { isLoading, isError, refetch, ...rest } = useQuery({
    queryKey: ['organizations', params],
    queryFn: () => httpGetOrganizations(params),
    select: (response) => {
      const list = get(response, 'data.data.list', []);
      const total = get(response, 'data.data.total', 0);

      return {
        data: makeItMap(list, 'organizationId'),
        total
      };
    }
  });

  const { data, total } = rest?.data || { data: new Map(), total: 0 };

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    const id = event.currentTarget.dataset.id;
    setSelectedItemId(+id);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteMenuItem = () => {
    setActionType('delete');
  };

  const handleEditMenuItem = () => {
    setSelectedItemId(selectedItemId);
    navigate(`edit/${selectedItemId}`);
  };

  const clearAction = () => setActionType('');

  const deleteMutate = useMutation(httpDeleteOrganization, {
    onSuccess: (response) => {
      setOpen(null);
      setSelectedItemId(null);
      setActionType('view');
      refetch();

      notification.setMode('success').setMessage(t('Deleted successfully')).success();
    },
    onError: (error) => {
      notification.setMode('error').setMessage(t('Error occurred'));
    }
  });

  const handleDelete = () => {
    deleteMutate.mutate(selectedItemId);
  };

  const isNotFound = !Array.from(data.values()).length && !!context.search.value;

  const listContent = (
    <MyTable
      handleTableClick={(id) => navigate(`edit/${id}?readOnly=true`)}
      trCursorPointerOnHover
      handleSizeChange={handleSizeChange}
      orderBy={null}
      headLabel={TABLE_HEAD}
      rowCount={size}
      total={total}
      filterName={context.search.value}
      isNotFound={isNotFound}
      handlePageChange={handlePageChange}
      size={size}
      page={page}
      count={Math.ceil(total / size)}
      lastColumnFixed
      loading={isLoading}>
      {Array.from(data.values()).map((row, i) => {
        const { organizationName, organizationId } = row;

        return (
          <TableRow hover key={i} data-id={organizationId} tabIndex={-1} role="checkbox">
            <TableCell align="center">{i + 1}</TableCell>
            <TableCell align="left">{organizationName}</TableCell>
            <TableCell align="right" width="2%">
              <Box display="flex" alignItems="center">
                {hasAccessToClientRelatedActions && (
                  <IconButton
                    size="large"
                    data-id={organizationId}
                    color="inherit"
                    onClick={handleOpenMenu}
                    sx={{ width: 24, height: 24 }}>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </IconButton>
                )}
              </Box>
            </TableCell>
          </TableRow>
        );
      })}
    </MyTable>
  );

  const mainContent = isError ? <h2>Error :(</h2> : listContent;

  return (
    <>
      <Helmet>
        <title> {t('Organizations')} </title>
      </Helmet>

      <PageContentWrapper sx={{ height: 'max-content' }}>
        <PageHeader
          title={t('Organization')}
          right={<PlusButton to="add">{t('New Organization')}</PlusButton>}
        />
        <ContentWrapper sx={{ pb: 0 }}>{mainContent}</ContentWrapper>
      </PageContentWrapper>

      <MyMenu
        open={open}
        handleClose={handleCloseMenu}
        items={[
          {
            icon: faPen,
            content: t('Edit'),
            onClick: handleEditMenuItem
          },
          {
            icon: faTrash,
            content: t('Delete'),
            sx: { color: 'error.main' },
            onClick: handleDeleteMenuItem
          }
        ]}
      />

      <MyModal
        type="confirmation"
        open={actionType === 'delete'}
        handleClose={clearAction}
        withActionButtons
        ok={t('Delete')}
        handleCancel={clearAction}
        handleOk={handleDelete}
        actionLoading={deleteMutate.isLoading}
        confirmationSx={{ display: 'block' }}
        bodySx={{ height: 'auto' }}
        okProps={{ color: 'error' }}
        cancelProps={{ color: 'error' }}>
        <DeleteConfirmation />
      </MyModal>

      <MyModal
        type=""
        open={actionType === 'create' || actionType === 'edit'}
        handleClose={clearAction}
        withActionButtons={false}
        ok={actionType === 'create' ? t('Create') : t('Edit')}
        bodySx={{
          width: '450px',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .rdw-editor-main': {
            maxWidth: '400px'
          }
        }}>
        {actionType === 'create' ? (
          <CreateOrganizationForm handleClose={clearAction} />
        ) : (
          <EditOrganizationForm
            handleClose={clearAction}
            {...data.get(selectedItemId)}
            id={selectedItemId}
          />
        )}
      </MyModal>
    </>
  );
}
