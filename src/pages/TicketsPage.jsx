import { lazy, Suspense } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import useUserStore from 'clientStore/useUserStore';
import ContentWrapper from 'components/ContentWrapper';
import DeleteConfirmation from 'components/DeleteConfirmation';
import MyButton from 'components/MyButton';
import MyModal from 'components/MyModal';
import MyTable from 'components/MyTable';
import MyTextField from 'components/MyTextField';
import MyTooltip from 'components/MyTooltip';
import PageContentWrapper from 'components/PageContentWrapper';
import PageHeader from 'components/PageHeader';
import TableFilterProvider, {
  MULTIPLE_MODE_BLUEPRINT_VALUES,
  TableFilterContext
} from 'contexts/TableFilterContext';
import {
  httpDeleteTicket,
  httpGetBugTicketCountsByOrganization,
  httpGetTicketStatsByDev,
  httpGetTicketStatsByModule,
  httpGetTicketStatsBySide,
  httpGetTicketStatsByStatus,
  httpGetTickets
} from 'data/ticket';
import { prepareTicketRenderList } from 'data/ticket/ticket.service';
import useUser from 'hooks/helpers/useUser';
import useTable from 'hooks/useTable';
import get from 'lodash.get';
import { useContext, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import notification from 'services/notification';
import { globalStyles } from 'theme/globalStyles';
import { useDebounce } from 'usehooks-ts';
import { getTaskTypeOptions, TICKET_TYPE_ICONS } from 'utils/common';
import { extractObjectPart, makeItMap } from 'utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import PlusButton from 'components/PlusButton';
import { faEllipsisVertical, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import MyMenu from 'components/MyMenu';

const TicketViewDialog = lazy(() => import('components/TicketViewDialog'));

const generateMultipleModeBlueprint = ({ key = '', searchParams, converter }) => {
  const idKey = `${key}Id`;
  const nameKey = `${key}Name`;
  if (!searchParams.has(idKey)) {
    return MULTIPLE_MODE_BLUEPRINT_VALUES;
  }

  const id =
    (converter && converter(searchParams.get(idKey))) || parseInt(searchParams.get(idKey), 10);

  const values = new Map([[id, true]]);

  return {
    ...MULTIPLE_MODE_BLUEPRINT_VALUES,
    values,
    touched: true,
    options: [
      {
        label: searchParams.get(nameKey),
        value: id
      }
    ]
  };
};

const styles = {
  table: {}
};

export default function TicketsPage() {
  const [searchParams] = useSearchParams();

  const clientIdDefaultValues = useMemo(
    () =>
      generateMultipleModeBlueprint({
        key: 'client',
        searchParams
      }),
    [searchParams]
  );

  const typeIdDefaultValues = useMemo(
    () =>
      generateMultipleModeBlueprint({
        key: 'module',
        searchParams
      }),
    [searchParams]
  );

  const devIdDefaultValues = useMemo(
    () =>
      generateMultipleModeBlueprint({
        key: 'dev',
        searchParams
      }),
    [searchParams]
  );

  const sideDefaultValues = useMemo(
    () =>
      generateMultipleModeBlueprint({
        key: 'side',
        searchParams,
        converter: (id) => id
      }),
    [searchParams]
  );

  const organizationIdDefaultValues = useMemo(
    () =>
      generateMultipleModeBlueprint({
        key: 'organization',
        searchParams
      }),
    [searchParams]
  );

  const statusDefaultValues = useMemo(
    () =>
      generateMultipleModeBlueprint({
        key: 'status',
        searchParams,
        converter: (id) => id
      }),
    [searchParams]
  );

  return (
    <TableFilterProvider
      value={{
        status: statusDefaultValues,
        developerId: devIdDefaultValues,
        clientId: clientIdDefaultValues,
        sideId: sideDefaultValues,
        typeId: typeIdDefaultValues,
        organizationId: organizationIdDefaultValues,
        regDateOrder: 'asc',
        bugFixDateOrder: 'asc',
        search: {
          headerSearch: true,
          type: 'search',
          value: '',
          touched: false
        },
        regDate: {},
        bugFixDate: {}
      }}>
      <Tickets />
    </TableFilterProvider>
  );
}

function Tickets() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const user = useUser();
  const { project } = useUserStore();
  const xlUp = useMediaQuery(theme.breakpoints.up('xl'));
  const {
    tableState: { page, size },
    handleSizeChange,
    setDynamicValues
  } = useTable({ search: '', page: 1, size: 10 });

  const context = useContext(TableFilterContext);
  const search = context.search.value;

  const debouncedSearch = useDebounce(search, 300);
  const [actionType, setActionType] = useState('view');
  const [open, setOpen] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const params = useMemo(
    () => ({
      ...(project?.value && { projectId: parseInt(project?.value, 10) }),
      ...context.query,
      search: debouncedSearch
    }),
    [debouncedSearch, context.query, project]
  );

  console.log(params);

  const queryByStatusParams = extractObjectPart({
    type: 'exclude',
    keys: ['status'],
    obj: params
  });

  const queryByDevParams = extractObjectPart({
    type: 'exclude',
    keys: ['developerId'],
    obj: params
  });

  const queryBySideParams = extractObjectPart({
    type: 'exclude',
    keys: ['side'],
    obj: params
  });

  const queryByModuleParams = extractObjectPart({
    type: 'exclude',
    keys: ['typeId'],
    obj: params
  });

  const queryByOrganizationParams = extractObjectPart({
    type: 'exclude',
    keys: ['organizationId'],
    obj: params
  });

  const queryByStatus = useQuery({
    queryKey: ['tickets-query-by-status', queryByStatusParams],
    queryFn: () => httpGetTicketStatsByStatus(queryByStatusParams),
    enabled: false,
    cacheTime: 0
  });

  const queryByDev = useQuery({
    queryKey: ['tickets-query-by-dev', queryByDevParams],
    queryFn: () => httpGetTicketStatsByDev(queryByDevParams),
    enabled: false,
    cacheTime: 0
  });

  const queryBySide = useQuery({
    queryKey: ['tickets-query-by-side', queryBySideParams],
    queryFn: () => httpGetTicketStatsBySide(queryBySideParams),
    enabled: false,
    cacheTime: 0
  });

  const queryByModule = useQuery({
    queryKey: ['tickets-query-by-module', queryByModuleParams],
    queryFn: () => httpGetTicketStatsByModule(queryByModuleParams),
    enabled: false,
    cacheTime: 0
  });

  const queryByOrganization = useQuery({
    queryKey: ['tickets-query-by-organization', queryByOrganizationParams],
    queryFn: () => httpGetBugTicketCountsByOrganization(queryByOrganizationParams),
    enabled: false,
    cacheTime: 0
  });

  console.log({ xlUp });

  const TABLE_HEAD = [
    { id: 'number', label: '', align: 'center', width: '2%' },
    {
      id: 'type',
      label: '',
      align: 'center',
      width: xlUp ? '2%' : '4%',
      filter: true,
      filterSx: {
        width: {
          xs: 200,
          sm: 250
        }
      },
      type: 'multiple',
      key: 'status',
      fc: async () => {
        const result = await queryByStatus.refetch();

        const labels = getTaskTypeOptions(t);

        const counts = get(result, 'data.data.data', []).map((item) => ({
          value: item.status,
          label: labels[item.status],
          count: item._count
        }));

        return {
          status: {
            touched: context.status.touched,
            headerSearch: true,
            type: 'multiple',
            options: counts,
            search: context?.status?.search || '',
            values:
              context?.status?.values ||
              counts.reduce((acc, cur) => acc.set(cur.value, true), new Map()),
            queryKey: ['tickets-query-by-status', queryByStatusParams]
          }
        };
      }
    },
    {
      id: 'project',
      label: t('Project'),
      align: 'left',
      filter: false,
      key: 'search',
      type: 'search',
      width: xlUp ? '8%' : '6%',
      filterSx: { width: { xs: 200, sm: 250 } },
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
      id: 'ticket-name',
      label: t('Ticket title'),
      align: 'left',
      filter: false,
      key: 'search',
      type: 'search',
      width: '20%',
      filterSx: { width: { xs: 200, sm: 250 } },
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
      id: 'organization',
      label: t('Organization'),
      filter: true,
      align: 'left',
      width: '15%',
      filterSx: {
        width: {
          xs: 200,
          sm: 250
        }
      },
      type: 'multiple',
      key: 'organizationId',
      fc: async () => {
        const result = await queryByOrganization.refetch();

        const counts = get(result, 'data.data.data', []);

        return {
          organizationId: {
            touched: context.organizationId.touched,
            headerSearch: true,
            type: 'multiple',
            options: counts,
            search: context?.organizationId?.search || '',
            values:
              context?.organizationId?.values ||
              counts.reduce((acc, cur) => acc.set(cur.value, true), new Map()),
            queryKey: ['tickets-query-by-organization', queryByOrganizationParams]
          }
        };
      }
    },
    {
      id: 'dev',
      label: t('Dev'),
      align: 'left',
      filter: true,
      width: '12%',
      filterSx: {
        width: {
          xs: 200,
          sm: 250
        }
      },
      type: 'multiple',
      key: 'developerId',
      fc: async () => {
        const result = await queryByDev.refetch();

        const counts = get(result, 'data.data.data', []);

        return {
          developerId: {
            touched: context.developerId.touched,
            headerSearch: true,
            type: 'multiple',
            options: counts,
            search: context.developerId?.search || '',
            values:
              context.developerId?.values ||
              counts.reduce((acc, cur) => acc.set(cur.value, true), new Map()),
            queryKey: ['tickets-query-by-dev', queryByDevParams]
          }
        };
      }
    },

    {
      id: 'side',
      label: t('Side'),
      align: 'left',
      width: '10%',
      filter: true,
      filterSx: {
        width: {
          xs: 200,
          sm: 250
        }
      },
      type: 'multiple',
      key: 'sideId',
      fc: async () => {
        const result = await queryBySide.refetch();

        const counts = get(result, 'data.data.data', []);

        return {
          sideId: {
            touched: context.sideId.touched,
            headerSearch: true,
            type: 'multiple',
            options: counts,
            search: context?.sideId?.search || '',
            values:
              context?.sideId?.values ||
              counts.reduce((acc, cur) => acc.set(cur.value, true), new Map()),
            queryKey: ['tickets-query-by-side', queryBySideParams]
          }
        };
      }
    },
    {
      id: 'module',
      label: t('Module'),
      align: 'left',
      width: '10%',
      filter: true,
      filterSx: {
        width: {
          xs: 200,
          sm: 250
        }
      },
      type: 'multiple',
      key: 'typeId',
      fc: async () => {
        const result = await queryByModule.refetch();

        const counts = get(result, 'data.data.data', []);

        return {
          typeId: {
            touched: context.typeId.touched,
            headerSearch: true,
            type: 'multiple',
            options: counts,
            search: context?.typeId?.search || '',
            values:
              context?.typeId?.values ||
              counts.reduce((acc, cur) => acc.set(cur.value, true), new Map()),
            queryKey: ['tickets-query-by-module', queryByModuleParams]
          }
        };
      }
    },
    {
      id: 'reg-date',
      label: t('Reg Date'),
      align: 'right',
      width: '9%',
      sort: true,
      filter: true,
      type: 'date-comparison',
      orderKey: 'regDateOrder',
      key: 'regDate',
      filterSx: {
        width: {
          xs: 240
        }
      },
      fc: () => ({
        regDate: {
          headerSearch: false,
          type: 'date-comparison',
          ...context?.regDate
        }
      })
    },
    {
      id: 'bug-fix',
      width: '9%',
      align: 'right',
      label: t('Fix date'),
      sort: true,
      filter: true,
      orderKey: 'bugFixDateOrder',
      key: 'bugFixDate',
      type: 'date-comparison',
      filterSx: {
        width: {
          xs: 240
        }
      },
      fc: () => ({
        bugFixDate: {
          headerSearch: false,
          type: 'date-comparison',

          ...context?.bugFixDate
        }
      })
    },
    {
      id: '',
      width: '3%'
    }
  ];

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tickets', { page: page - 1, size, ...params }],
    queryFn: () =>
      httpGetTickets({
        page: page - 1,
        size,
        ...params
      }),
    select: ({ data }) => {
      return {
        ...data.data,
        list: makeItMap(data.data.list.map(prepareTicketRenderList))
      };
    },
    enabled: context.ready
  });

  const list = data?.list || new Map();

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    const id = event.currentTarget.dataset.id;
    setSelectedItemId(id);
    setActionType('mutate');
    setOpen(event.currentTarget);
  };

  const handlePageChange = (t, page) => {
    setDynamicValues({ page });
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

  const deleteMutate = useMutation(httpDeleteTicket, {
    onSuccess: () => {
      setOpen(null);
      setSelectedItemId(null);
      setActionType('view');

      const index = list.get(Number(selectedItemId)).i;

      if (index === 0) {
        setDynamicValues({ page: page >= 2 ? page - 1 : page });
      }

      notification.setMode('success').setMessage(t('Deleted successfully')).pop();

      refetch();
    },
    onError: (error) => {
      notification.setMode('error').setMessage(error?.message).pop();
    }
  });

  const handleDelete = () => {
    deleteMutate.mutate(selectedItemId);
  };

  const isNotFound = !Array.from(list.values()).length && !!search;

  const listContent = (
    <MyTable
      handleTableClick={(id) => {
        setSelectedItemId(id);
        setActionType('view');
      }}
      handleSizeChange={handleSizeChange}
      trCursorPointerOnHover
      orderBy={null}
      headLabel={TABLE_HEAD}
      count={Math.ceil(data?.total / size)}
      filterName={search}
      isNotFound={isNotFound}
      size={size}
      page={page}
      handlePageChange={handlePageChange}
      tableSx={styles.table}
      loading={isLoading}
      lastColumnFixed>
      {Array.from(list.values()).map((row, i) => {
        const {
          id,
          client: {
            organization: { organizationName },
            project: { projectName }
          },
          createdByMe,
          regDate,
          type,
          side,
          module,
          dev,
          bugFixDate,
          name,
          hasAttachments
        } = row;

        return (
          <TableRow data-id={id} key={id} tabIndex={-1} role="checkbox">
            <TableCell align="center" width="2%">
              {(page - 1) * size + 1 + i}.
            </TableCell>
            <TableCell align="center" width="2%">
              <FontAwesomeIcon
                style={{ width: '1.3rem', height: '1.3rem' }}
                icon={TICKET_TYPE_ICONS[type]}
                color={theme.palette.primary.main}
              />
            </TableCell>
            <TableCell width="8%">
              <MyTooltip title={projectName}>
                <Typography variant="body2" children={projectName} sx={globalStyles.ellipsis(1)} />
              </MyTooltip>
            </TableCell>
            <TableCell width="20%">
              <MyTooltip title={name}>
                <Typography
                  variant="body2"
                  children={
                    <>
                      {' '}
                      {hasAttachments && (
                        <FontAwesomeIcon
                          style={{ marginRight: '3px' }}
                          icon={faPaperclip}
                          color={theme.palette.common.icon.main}
                        />
                      )}
                      {name}
                    </>
                  }
                  sx={globalStyles.ellipsis(1)}
                />
              </MyTooltip>
            </TableCell>
            <TableCell align="left" width="15%">
              <MyTooltip title={organizationName}>
                <Typography
                  variant="body2"
                  children={organizationName}
                  sx={globalStyles.ellipsis(1)}
                />
              </MyTooltip>
            </TableCell>

            <TableCell align="left" width="12%">
              <MyTooltip title={dev}>
                <Typography children={dev} sx={globalStyles.ellipsis(1)} />
              </MyTooltip>
            </TableCell>

            <TableCell align="left" width="10%">
              {side?.name}
            </TableCell>
            <TableCell align="left" width="10%">
              {module}
            </TableCell>

            <TableCell align="right" width="10%">
              {regDate}
            </TableCell>

            <TableCell align="right" width="10%">
              {bugFixDate}
            </TableCell>

            <TableCell align="right" width="1%">
              <Box display="flex" alignItems="center">
                {(createdByMe || user?.role?.name === 'manager') && (
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

  const mainContent = listContent;

  return (
    <>
      <Helmet>
        <title> {t('Tickets')} </title>
      </Helmet>

      <Suspense fallback={<div />}>
        <TicketViewDialog
          id={selectedItemId}
          open={Boolean(selectedItemId) && actionType === 'view'}
          handleClose={() => {
            setSelectedItemId(null);
            setActionType('initial');
          }}
        />
      </Suspense>

      <PageContentWrapper sx={{ height: 'max-content' }}>
        <PageHeader
          title={t('Tickets')}
          right={
            <Stack direction="row" alignItems="center" columnGap="8px">
              {searchParams.has('from') && (
                <MyButton
                  startIcon={<ArrowBackIcon />}
                  variant="contained"
                  onClick={() => navigate(-1)}>
                  {t('Back')}
                </MyButton>
              )}
              <PlusButton to="add">{t('New Ticket')}</PlusButton>
            </Stack>
          }
        />
        <ContentWrapper sx={{ pb: 0 }}>
          <Box sx={{ width: '350px', px: '18px', mb: 3.5 }}>
            <MyTextField
              name="search"
              onFocus={() => context.setActiveKey('search')}
              onChange={context.handleSearch}
              value={context.search.value}
              size="small"
              placeholder={t('Search...')}
              clearable
              onClear={() => {
                context.handleSearch({ target: { value: '' } });
              }}
            />
          </Box>
          {mainContent}
        </ContentWrapper>
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
