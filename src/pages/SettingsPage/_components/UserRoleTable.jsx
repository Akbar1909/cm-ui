import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Stack } from '@mui/material';
import MyTable from 'components/MyTable';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
import { makeItMap } from 'utils/helpers';
import { TableCell, TableRow } from '@mui/material';
import MyTextField from 'components/MyTextField';
import CheckIcon from '@mui/icons-material/Check';
import notification from 'services/notification';
import MyModal from 'components/MyModal';
import DeleteConfirmation from 'components/DeleteConfirmation';
import { useEffect } from 'react';
import { useCallback } from 'react';
import {
  httpDeleteTicketSide,
  httpGetManyTicketSide,
  httpPostTicketSide,
  httpPatchTicketSide
} from 'data/ticketSide';
import { httpDeleteRoles, httpGetRoles, httpPostRoles, httpPutRoles } from 'data/role';
import { httpPutClient } from 'data/client';

const initialValues = {
  name: ''
};

const UserRoleTable = ({ selectedAction, setSelectedAction }) => {
  const { t } = useTranslation();

  const [values, setValues] = useState({ name: '' });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-roles'],
    queryFn: httpGetRoles,
    select: (response) => makeItMap(response.data?.data)
  });

  const clearAction = () => {
    setSelectedAction({ id: null, action: 'idle' });
  };

  const updateMutation = useMutation(httpPutRoles, {
    onSuccess: () => {
      notification.setMode('success').setMessage(t('Role successfully updated')).pop();

      setValues(initialValues);
      clearAction();
      refetch();
    },
    onError: () => {
      notification.setMode('error').setMessage(t('Something went wrong')).pop();
    }
  });

  const createMutation = useMutation(httpPostRoles, {
    onSuccess: () => {
      notification.setMode('success').setMessage(t('New Role successfully added')).pop();

      setValues(initialValues);
      clearAction();
      refetch();
    },
    onError: () => {
      notification.setMode('error').setMessage(t('Something went wrong')).pop();
    }
  });

  const deleteMutation = useMutation(httpDeleteRoles, {
    onSuccess: () => {
      notification.setMode('success').setMessage(t('Role successfully deleted')).pop();
      clearAction();
      refetch();
    },
    onError: () => {
      notification.setMode('error').setMessage(t('Something went wrong')).pop();
    }
  });

  const headLabel = [
    {
      label: '',
      align: 'center',
      width: '5%'
    },
    {
      label: t('Name'),
      width: '95%',
      align: 'left'
    },
    {
      id: '',
      width: '2%'
    }
  ];

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createOrUpdate = useCallback(() => {
    if (selectedAction.action === 'create') {
      createMutation.mutate(values);
      return;
    }

    updateMutation.mutate({ id: selectedAction.id, ...values });
  }, [updateMutation, selectedAction, createMutation, values]);

  const handleEnter = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        createOrUpdate();
      }
    },
    [createOrUpdate]
  );

  useEffect(() => {
    document.addEventListener('keypress', handleEnter);
    return () => document.removeEventListener('keypress', handleEnter);
  }, [handleEnter]);

  return (
    <>
      <Helmet>
        <title>{t('Ticket module')}</title>
      </Helmet>

      <MyTable lastColumnFixed headLabel={headLabel} withPagination={false} isLoading={isLoading}>
        {data &&
          [...Array.from(data.values()), selectedAction.action === 'create' ? {} : null].map(
            (row, i) => {
              if (!row) {
                return null;
              }

              const { id, name } = row;
              const renderSaveButton =
                (selectedAction.id === id && selectedAction.action === 'edit') ||
                (selectedAction.action === 'create' && !id);
              return (
                <TableRow hover key={id}>
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell align="left">
                    {renderSaveButton ? (
                      <MyTextField
                        name="name"
                        size="small"
                        value={values.name}
                        onChange={handleChange}
                      />
                    ) : (
                      name
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center">
                      <IconButton size="small">
                        {renderSaveButton ? (
                          <CheckIcon onClick={createOrUpdate} />
                        ) : (
                          <EditIcon
                            onClick={() => {
                              setSelectedAction({ id, action: 'edit' });
                              setValues((prev) => ({ ...prev, name }));
                            }}
                            sx={{ cursor: 'pointer' }}
                          />
                        )}
                      </IconButton>
                      <IconButton size="small">
                        {selectedAction.id === id && selectedAction.action === 'edit' ? (
                          <CloseIcon
                            onClick={() => {
                              clearAction();
                              setValues(initialValues);
                            }}
                          />
                        ) : (
                          <DeleteIcon
                            onClick={() => setSelectedAction({ id, action: 'delete' })}
                            sx={{ cursor: 'pointer' }}
                          />
                        )}
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            }
          )}
      </MyTable>

      <MyModal
        type="confirmation"
        open={selectedAction.action === 'delete'}
        handleClose={clearAction}
        withActionButtons
        ok={t('Delete')}
        handleCancel={clearAction}
        handleOk={() => {
          deleteMutation.mutate(selectedAction.id);
        }}
        actionLoading={deleteMutation.isLoading}
        confirmationSx={{ display: 'block' }}
        bodySx={{ height: 'auto' }}
        okProps={{ color: 'error' }}
        cancelProps={{ color: 'error' }}>
        <DeleteConfirmation />
      </MyModal>
    </>
  );
};

export default UserRoleTable;
