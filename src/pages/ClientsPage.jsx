import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext, useState, useMemo } from 'react';
import { TableRow, TableCell, Typography, IconButton, Box } from '@mui/material';
import get from 'lodash.get';
import notification from 'services/notification';
import { makeItMap } from 'utils/helpers';
import MyTable from 'components/MyTable';
import { useTranslation } from 'react-i18next';
import MyModal from 'components/MyModal';
import { useNavigate } from 'react-router-dom';
import {
  httpDeleteClient,
  httpGetClients,
  httpGetGroupedStatusIdCount,
  prepareClientForList
} from 'data/client';
import TableFilterProvider, { TableFilterContext } from 'contexts/TableFilterContext';
import useUser from 'hooks/helpers/useUser';
import { globalStyles } from 'theme/globalStyles';
import DeleteConfirmation from 'components/DeleteConfirmation';
import PageHeader from 'components/PageHeader';
import PageContentWrapper from 'components/PageContentWrapper';
import MyTooltip from 'components/MyTooltip';
import { MULTIPLE_MODE_BLUEPRINT_VALUES } from 'contexts/TableFilterContext/TableFilterProvider';
import MyTextField from 'components/MyTextField';
import { useDebounce } from 'usehooks-ts';
import { extractObjectPart } from 'utils/helpers';
import useTable from 'hooks/useTable';
import useUserStore from 'clientStore/useUserStore';
import ContentWrapper from 'components/ContentWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPen, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import PlusButton from 'components/PlusButton';
import MyMenu from 'components/MyMenu';

export default function ClientsPage() {
  return (
    <TableFilterProvider
      value={{
        contractDueTo: {},
        search: {
          headerSearch: true,
          type: 'search',
          value: '',
          touched: false
        },
        statusId: MULTIPLE_MODE_BLUEPRINT_VALUES
      }}>
      <Clients />
    </TableFilterProvider>
  );
}
function Clients() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useUser();
  const { project } = useUserStore();
  const { query, activeKey, handleSearch, ...context } = useContext(TableFilterContext);
  const { hasAccessToClientRelatedActions } = useUserStore();
  const {
    tableState: { page, size },
    handleSizeChange,
    setDynamicValues
  } = useTable({ search: '' });

  const [actionType, setActionType] = useState('view');
  const [open, setOpen] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const contractDueTo = context?.['contractDueTo'];

  const params = {
    ...query,
    page,
    size,
    search: debouncedSearch,
    projectId: project?.value
  };

  const handlePageChange = (t, page) => {
    setDynamicValues({ page });
  };

  const queryByStatusIdParams = extractObjectPart({
    type: 'exclude',
    keys: ['statusId'],
    obj: params
  });

  const queryByStatus = useQuery({
    queryKey: ['clients-query-by-status', queryByStatusIdParams],
    queryFn: () => httpGetGroupedStatusIdCount(queryByStatusIdParams),
    enabled: false,
    cacheTime: 0
  });

  const TABLE_HEAD = useMemo(
    () => [
      { id: 'number', label: '', align: 'center', width: '2%' },
      {
        id: 'status',
        label: '',
        align: 'center',
        width: '2%',
        filter: true,
        type: 'multiple',
        filterSx: {
          width: {
            xs: 240
          }
        },
        key: 'statusId',
        fc: async () => {
          const result = await queryByStatus.refetch();

          const counts = get(result, 'data.data.data', []);

          return {
            statusId: {
              touched: context.statusId.touched,
              headerSearch: true,
              type: 'multiple',
              options: counts,
              search: context.statusId?.search || '',
              values:
                context.statusId?.values ||
                counts.reduce((acc, cur) => acc.set(cur.value, true), new Map()),
              queryKey: ['clients-query-by-status', queryByStatusIdParams]
            }
          };
        }
      },
      {
        id: 'client',
        label: t('Name'),
        align: 'left',
        width: '16%',
        filterSx: {
          width: {
            xs: 200,
            sm: 250
          }
        },
        key: 'search',
        type: 'search',
        filter: false,
        fc: async () => ({
          search: {
            headerSearch: false,
            type: 'search',
            value: context.search.value || '',
            touched: context.search.touched
          }
        })
      },
      {
        id: 'client-name',
        label: t('Contact name'),
        align: 'left',
        width: '18%'
      },
      {
        label: t('Projects'),
        align: 'left',
        width: '10%',
        filter: false
      },

      { id: 'client-phone', label: t('Phone'), align: 'right', width: '10%' },
      {
        id: 'device-count',
        label: t('PC'),
        align: 'right',
        width: '10%',
        sort: true,
        orderKey: 'deviceCount'
      },
      {
        id: 'total-tickets',
        label: t('Total tickets'),
        align: 'right',
        width: '8%',
        sort: true,
        orderKey: 'totalTickets'
      },
      {
        id: 'due-to',
        label: t('Due to'),
        align: 'right',
        type: 'date-comparison',
        filter: true,
        key: 'contractDueTo',
        width: '11%',
        filterSx: {
          width: {
            xs: 262
          }
        },
        fc: () => ({
          contractDueTo: {
            headerSearch: false,
            type: 'date-comparison',
            ...contractDueTo
          }
        })
      },
      {
        id: 'last-activity',
        label: t('Last activity'),
        align: 'right',
        width: '11%',
        orderKey: 'lastActivityDateOrder',
        sort: true
      },
      { id: '', width: '2%' }
    ],
    [t, contractDueTo, context]
  );

  const { isLoading, isError, isFetching, refetch, isRefetching, ...rest } = useQuery({
    queryKey: ['clients', params],
    queryFn: () => httpGetClients({ select: 0, ...params }),
    select: (response) => {
      if (response.data?.status !== 'success') {
        return {
          data: new Map(),
          total: null
        };
      }

      return {
        data: makeItMap(prepareClientForList(response.data.data?.list)),
        total: response.data.data?.total
      };
    }
  });
  const { data = new Map(), total = null } = rest.data || {};

  const handleOpenMenu = (event) => {
    const id = event.currentTarget.dataset.id;
    setSelectedItemId(id);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleMenuItem = (e) => {
    const { type } = e.target.dataset;

    if (type === 'edit') {
      navigate(`edit/${selectedItemId}`);
      return;
    }

    if (type === 'delete') {
      setActionType('delete');
      return;
    }

    if (type === 'view') {
      navigate(`view/tickets/${selectedItemId}`);
    }
  };

  const clearAction = () => setActionType('');

  const deleteMutate = useMutation(httpDeleteClient, {
    onSuccess: () => {
      setOpen(null);
      setSelectedItemId(null);
      setActionType('view');

      refetch();

      notification.setMode('success').setMessage(t('Deleted successfully')).success();
    }
  });

  const handleDelete = () => {
    deleteMutate.mutate(selectedItemId);
  };

  const listContent = useMemo(() => {
    const isNotFound = !Array.from(data.values()).length && !!query?.search;

    return (
      <MyTable
        orderBy={null}
        handleSizeChange={handleSizeChange}
        headLabel={TABLE_HEAD}
        rowCount={size}
        isNotFound={isNotFound}
        loading={isLoading}
        backgroundFetching={isFetching || isRefetching}
        size={size}
        page={page}
        count={Math.ceil(total / size)}
        handlePageChange={handlePageChange}
        lastColumnFixed>
        {Array.from(data.values()).map((row, i) => {
          const {
            id,
            contactName,
            contractDueTo,
            deviceCount,
            phone,
            status,
            createdByMe,
            totalTickets,
            organizationName,
            projectName
          } = row;

          return (
            <TableRow key={id} tabIndex={-1} role="checkbox">
              <TableCell align="center" width="2%">
                {(page - 1) * size + 1 + i}.
              </TableCell>
              <TableCell width="1%">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: (theme) =>
                      theme.palette.common[status === 'active' ? 'request' : 'bug_report'],
                    mr: 2
                  }}
                />
              </TableCell>
              <TableCell align="left" width="17%">
                <MyTooltip title={organizationName}>
                  <Typography
                    variant="body2"
                    children={organizationName}
                    sx={globalStyles.ellipsis(1)}
                  />
                </MyTooltip>
              </TableCell>
              <TableCell width="18%">{contactName}</TableCell>
              <TableCell align="left" width="10%">
                <MyTooltip title={projectName}>
                  <Typography
                    variant="body2"
                    children={projectName}
                    sx={globalStyles.ellipsis(1)}
                  />
                </MyTooltip>
              </TableCell>

              <TableCell align="right" width="10%">
                {phone}
              </TableCell>

              <TableCell align="right" width="10%">
                {deviceCount}
              </TableCell>
              <TableCell align="right" width="8%">
                {totalTickets}
              </TableCell>
              <TableCell align="right" width="11%">
                {contractDueTo}
              </TableCell>
              <TableCell align="right" width="11%">
                {contractDueTo}
              </TableCell>
              <TableCell align="right" width="2%">
                <Box display="flex" alignItems="center">
                  {(createdByMe || hasAccessToClientRelatedActions) && (
                    <IconButton
                      size="large"
                      data-id={id}
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
  }, [isFetching, isLoading, TABLE_HEAD, data, isRefetching, query?.search, user]);

  const mainContent = isError ? <h2>Error :(</h2> : listContent;

  return (
    <>
      <Helmet>
        <title> {t('Clients')} </title>
      </Helmet>

      <PageContentWrapper sx={{ height: 'max-content' }}>
        <PageHeader
          title={t('Clients')}
          right={<PlusButton to="add">{t('New Client')}</PlusButton>}
        />

        <ContentWrapper sx={{ pb: 0 }}>
          <Box sx={{ width: '350px', px: '18px', mb: 3.5 }}>
            <MyTextField
              name="search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              size="small"
              placeholder={t('Search...')}
              clearable
              onClear={() => {
                setSearch('');
              }}
            />
          </Box>
          {mainContent}
        </ContentWrapper>
      </PageContentWrapper>

      <MyMenu
        open={open}
        handleClose={handleCloseMenu}
        onClick={handleMenuItem}
        items={[
          {
            icon: faEye,
            content: t('View tickets'),
            args: {
              ['data-type']: 'view'
            }
          },
          {
            icon: faPen,
            content: t('Edit'),
            args: {
              ['data-type']: 'edit'
            }
          },
          {
            icon: faTrash,
            content: t('Delete'),
            sx: { color: 'error.main' },
            args: {
              ['data-type']: 'delete'
            }
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
