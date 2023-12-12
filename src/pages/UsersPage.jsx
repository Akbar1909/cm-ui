import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import { TableRow, TableCell, IconButton, Box } from '@mui/material';
import { httpDeleteUser, httpGetUsers } from 'data/user';
import { joinArray, makeItMap } from 'utils/helpers';
import MyTable from 'components/MyTable';
import { useTranslation } from 'react-i18next';
import MyModal from 'components/MyModal';
import { useNavigate } from 'react-router-dom';
import notification from 'services/notification';
import TableFilterProvider, { TableFilterContext } from 'contexts/TableFilterContext';
import DeleteConfirmation from 'components/DeleteConfirmation';
import PageHeader from 'components/PageHeader';
import PageContentWrapper from 'components/PageContentWrapper';
import ContentWrapper from 'components/ContentWrapper';
import useTable from 'hooks/useTable';
import PlusButton from 'components/PlusButton';
import { faEllipsisVertical, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import MyMenu from 'components/MyMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function UsersPage() {
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
      <UserList />
    </TableFilterProvider>
  );
}

function UserList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    tableState: { page, size }
  } = useTable({});

  const { query, ...context } = useContext(TableFilterContext);

  const [actionType, setActionType] = useState('view');
  const [open, setOpen] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const TABLE_HEAD = [
    { id: 'number', label: '', align: 'left', width: '2%' },
    {
      id: 'name',
      label: t('Name'),
      align: 'left',
      width: '25%',
      filter: true,
      filterSx: {
        width: {
          xs: 200,
          sm: 250
        }
      },
      key: 'search',
      type: 'search',
      fc: async () => ({
        search: {
          headerSearch: false,
          type: 'search',
          value: context.search.value || '',
          touched: context.search.touched
        }
      })
    },
    { id: 'phone', label: t('Phone number'), align: 'left', width: '15%' },
    { id: 'username', label: t('Username'), align: 'left', width: '15%' },
    {
      id: 'waiting-tickets',
      label: t('Waiting tickets'),
      align: 'center',
      width: '10%',
      sort: true,
      orderKey: 'openTicketCount'
    },
    {
      id: 'done-tickets',
      label: t('Done tickets'),
      align: 'center',
      width: '10%'
    },
    {
      id: 'total-tasks',
      label: t('Total tickets'),
      align: 'center',
      width: '10%'
    },
    { id: 'role', label: t('Role'), align: 'left', width: '11%' },
    { id: '', width: '2%' }
  ];

  const { isLoading, isError, refetch, ...rest } = useQuery({
    queryKey: ['users', { page, size, query }],
    queryFn: () => httpGetUsers({ page, size, ...query }),
    select: ({ data }) => {
      if (data?.status !== 'success') {
        return {
          data: new Map(),
          total: null
        };
      }
      return {
        data: makeItMap(data.data?.list),
        total: data.data?.total
      };
    }
  });

  const { data = new Map(), total = null } = rest.data || {};

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    const id = event.currentTarget.dataset.id;
    setSelectedItemId(id);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteMenuItem = () => {
    setActionType('delete');
  };

  const handleEditMenuItem = () => {
    navigate(`edit/${selectedItemId}`);
  };

  const clearAction = () => setActionType('');

  const deleteMutate = useMutation(httpDeleteUser, {
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

  console.log(data);

  const isNotFound = !Array.from(data.values()).length && !!context.search.value;

  const listContent = (
    <MyTable
      handleTableClick={(id) => navigate(`edit/${id}?readOnly=true`)}
      trCursorPointerOnHover
      orderBy={null}
      headLabel={TABLE_HEAD}
      rowCount={data.length}
      filterName={context.search.value}
      isNotFound={isNotFound}
      size={size}
      page={page}
      count={Math.ceil(total / size)}
      lastColumnFixed
      loading={isLoading}>
      {Array.from(data.values()).map((row, i) => {
        const {
          id,
          username,
          role,
          firstName,
          lastName,
          phone,
          totalTicketCount,
          doneTicketCount,
          openTicketCount
        } = row;

        return (
          <TableRow hover data-id={id} key={id} tabIndex={-1} role="checkbox">
            <TableCell align="center">{i + 1}</TableCell>
            <TableCell align="left">{joinArray([firstName, lastName])}</TableCell>
            <TableCell>{phone}</TableCell>

            <TableCell align="left">{username}</TableCell>

            <TableCell align="center">{openTicketCount}</TableCell>
            <TableCell align="center">{doneTicketCount}</TableCell>
            <TableCell align="center">{totalTicketCount}</TableCell>

            <TableCell align="left">{role}</TableCell>

            <TableCell align="right">
              <Box display="flex" alignItems="center">
                <IconButton
                  size="large"
                  data-id={id}
                  color="inherit"
                  onClick={handleOpenMenu}
                  sx={{ width: 24, height: 24 }}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </IconButton>
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
        <title> {t('Users')} </title>
      </Helmet>

      <PageContentWrapper sx={{ height: 'max-content' }}>
        <PageHeader title={t('User')} right={<PlusButton to="add">{t('New User')}</PlusButton>} />
        <ContentWrapper>{mainContent}</ContentWrapper>
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
    </>
  );
}
