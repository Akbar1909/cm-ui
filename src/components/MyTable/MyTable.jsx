import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Pagination,
  Box
} from '@mui/material';
import Scrollbar from 'components/scrollbar';
import MyTableHead from './TableHead';
import TableFilter from './TableFilter';
import Spinner from 'components/Spinner';
import { tableStyles } from './MyTable.styles';
import { TableFilterContext } from 'contexts/TableFilterContext';
import MySelect from 'components/MySelect';
import MyOverlay from 'components/MyOverlay';

const MyTable = ({
  order,
  orderBy = null,
  headLabel,
  count,
  numSelected,
  handleSelectAllClick,
  children,
  filterName,
  isNotFound,
  size,
  page,
  withPagination = true,
  handlePageChange,
  loading,
  tableSx,
  lastColumnFixed = false,
  handleTableClick,
  trCursorPointerOnHover = false,
  ...props
}) => {
  const { mode } = useContext(TableFilterContext);

  const handleSizeChange = (e) => props.handleSizeChange(e.target.value);

  return (
    <>
      <Scrollbar>
        <TableContainer
          sx={{
            minWidth: 800,
            overflowX: {
              xs: 'visible',
              md: 'auto'
            }
          }}>
          <Table
            onClick={(e) => {
              let clickedElement = e.target;

              while (clickedElement && clickedElement.tagName !== 'TR') {
                clickedElement = clickedElement.parentNode;
              }

              const id = clickedElement.getAttribute('data-id');

              if (id && handleTableClick) {
                handleTableClick(id);
              }
            }}
            sx={[
              lastColumnFixed && {
                '& thead>tr>th:nth-last-of-type': tableStyles.sticky,
                '& tbody>tr>td:nth-last-of-type': tableStyles.sticky
              },
              { tableLayout: 'fixed' },
              trCursorPointerOnHover && { '& tr': { cursor: 'pointer' } },
              ...(Array.isArray(tableSx) ? tableSx : [tableSx])
            ]}>
            <MyTableHead
              order={order}
              orderBy={orderBy}
              headLabel={headLabel}
              numSelected={numSelected}
              onSelectAllClick={handleSelectAllClick}
            />
            <Spinner loading={loading}>
              <TableBody sx={tableStyles.tbody}>{children}</TableBody>
            </Spinner>

            {isNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                    <Paper
                      sx={{
                        textAlign: 'center'
                      }}>
                      <Typography variant="h6" paragraph>
                        Not found
                      </Typography>

                      <Typography variant="body2">
                        No results found for &nbsp;
                        <strong>&quot;{filterName}&quot;</strong>.
                        <br /> Try checking for typos or using complete words.
                      </Typography>
                    </Paper>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      {withPagination && (
        <Box px="8px" py="16px" display="flex" justifyContent="end">
          <MySelect
            sx={{ width: 70 }}
            options={[
              { label: 5, value: 5 },
              { label: 10, value: 10 },
              { label: 20, value: 20 },
              { label: 30, value: 30 }
            ]}
            customSize="small"
            textAlign="right"
            rootSx={{ minWidth: 60 }}
            value={size}
            onChange={handleSizeChange}
          />
          <Pagination
            count={Number.isNaN(count) ? 0 : count}
            rowsPerPage={size}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            // onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}

      {mode === 'open' && createPortal(<TableFilter />, document.body, 'table-filter')}
    </>
  );
};

export default MyTable;
