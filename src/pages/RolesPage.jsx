import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { Card, Stack, TableRow, TableCell, Container, Typography, Box } from '@mui/material';
import { makeItMap } from 'utils/helpers';
import MyTable from 'components/MyTable';
import { useTranslation } from 'react-i18next';
import { httpGetRoles } from 'data/role';
import MyTooltip from 'components/MyTooltip';

export default function RolesPage() {
  const { t } = useTranslation();

  const TABLE_HEAD = [
    { id: 'number', label: '', align: 'center' },
    { id: 'name', label: t('Name'), align: 'left' },
    { id: 'permissions', label: t('Permissions'), align: 'left' }
  ];

  const {
    data = new Map(),
    isLoading,
    isError,
    isFetching,
    isRefetching
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => httpGetRoles(),
    select: (response) => {
      if (response.data?.status !== 'success') {
        return new Map();
      }
      return makeItMap(response.data.data);
    }
  });

  const isNotFound = !Array.from(data.values()).length;

  const listContent = (
    <MyTable
      orderBy={null}
      headLabel={TABLE_HEAD}
      rowCount={data.length}
      isNotFound={isNotFound}
      size={100}
      page={1}
      withPagination={false}
      loading={isLoading}
      backgroundFetching={isFetching || isRefetching}>
      {Array.from(data.values()).map((row, i) => {
        const { id, name, permissions } = row;

        return (
          <TableRow hover key={id} tabIndex={-1} role="checkbox">
            <TableCell align="center">{i + 1}</TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell>
              {permissions.map((permission, i) => (
                <Box key={i}>
                  <MyTooltip title={permission.description}>
                    {i + 1}. <b>{permission.key}</b>
                  </MyTooltip>
                </Box>
              ))}
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
        <title> {t('Clients')} </title>
      </Helmet>

      <Container sx={{ height: 'max-content' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {t('Role')}
          </Typography>
        </Stack>
        <Card id="test">{mainContent}</Card>
      </Container>
    </>
  );
}
