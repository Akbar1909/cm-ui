import PropTypes from 'prop-types';
import { useRef, useEffect, useCallback } from 'react';
import {
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  IconButton,
  Stack,
  Typography,
  Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import { useContext } from 'react';
import { TableFilterContext } from 'contexts/TableFilterContext';
import { tableHeaderStyles as styles, tableStyles } from './MyTable.styles';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

TableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onSelectAllClick: PropTypes.func
};

const attachScrollEventToParentEls = (filterIcon, cb) => {
  let el = filterIcon;

  while (el.parentElement) {
    el.parentElement.addEventListener('scroll', cb);
    el = el.parentElement;
  }
};

const detachScrollEventFromParentEls = (filterIcon, cb) => {
  let el = filterIcon;

  while (el.parentElement) {
    el.parentElement.removeEventListener('scroll', cb);
    el = el.parentElement;
  }
};

const FilterIcon = ({ headCell }) => {
  const filterIconRef = useRef();
  const {
    setTableFilter,
    activeKey,
    mode,
    resetProperty,
    [headCell.key]: config
  } = useContext(TableFilterContext);
  const theme = useTheme();
  const updatePos = useCallback(() => {}, []);

  useEffect(() => {
    if (!filterIconRef.current) {
      return;
    }

    const icon = filterIconRef.current;

    attachScrollEventToParentEls(icon, updatePos);

    return () => detachScrollEventFromParentEls(icon, updatePos);
  }, [updatePos]);

  const openFilter = async (e, { filterSx, type, fc, key }) => {
    e.stopPropagation();
    const box = filterIconRef.current.getBoundingClientRect();

    if (key === activeKey && mode === 'open') {
      setTableFilter({ mode: 'closed', activeKey: '' });
      return;
    }

    console.log(filterSx);

    setTableFilter({
      x: (box.left + box.right) / 2,
      y: (box.top + box.bottom) / 2,
      mode: 'open',
      sx: filterSx,
      type,
      activeKey: key,
      label: headCell?.label
    });

    let args;

    if (fc) {
      args = await fc();
    }

    setTableFilter(args);
  };

  return (
    <Stack direction="column" ml="4px" sx={{ order: 2 }}>
      {config.touched && (
        <IconButton
          sx={styles.tableHeadIconBox}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            resetProperty(headCell.key);
          }}
          children={
            <CloseIcon
              sx={{
                '&:hover': { color: (theme) => theme.palette.error.main },
                transition: 'color .3s'
              }}
            />
          }
        />
      )}
      <IconButton
        sx={styles.tableHeadIconBox}
        onClick={(e) => openFilter(e, headCell)}
        size="small"
        ref={filterIconRef}
        children={
          <FontAwesomeIcon
            icon={faFilter}
            color={theme.palette.common.icon.main}
            style={{
              width: '12px',
              height: '12px',
              ...(config.touched && { color: theme.palette.primary.main })
            }}
          />
        }
      />
    </Stack>
  );
};

const OrderIcon = ({ headCell, resetSort }) => {
  const { [headCell.orderKey]: orderValue, handleApply } = useContext(TableFilterContext);

  const orderDirectionIcon =
    orderValue === 'asc' ? (
      <FontAwesomeIcon icon={faArrowUp} />
    ) : (
      <FontAwesomeIcon icon={faArrowDown} />
    );

  const clearSort = (e) => {
    e.stopPropagation();
    handleApply('', 'sort');
    resetSort();
  };

  return (
    <Stack direction="column" sx={{ order: 2 }}>
      <IconButton
        size="small"
        sx={styles.tableHeadIconBox}
        onClick={clearSort}
        children={
          <CloseIcon
            sx={{
              '&:hover': { color: (theme) => theme.palette.error.main },
              transition: 'color .3s'
            }}
          />
        }
      />
      <IconButton size="small" sx={styles.tableHeadIconBox} children={orderDirectionIcon} />
    </Stack>
  );
};

function MyTableHead({ order, orderBy, headLabel }) {
  const { handleApply, activeKey, ...rest } = useContext(TableFilterContext);
  const [activeOrderKey, setActiveOrderKey] = useState(null);

  const handleSortIcon = ({ orderKey = '', sort = false }) => {
    if (!sort) {
      return;
    }

    setActiveOrderKey(orderKey);
    handleApply(orderKey, 'sort');
  };

  const resetSort = () => setActiveOrderKey(null);

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            width={headCell.width || '10%'}
            key={headCell.id}
            className={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
            {...(headCell.colSpan && { colSpan: headCell.colSpan })}
            sx={[headCell.sx, tableStyles.theadCell, headCell.sort && { cursor: 'pointer' }]}
            onClick={() => {
              handleSortIcon(headCell);
            }}>
            <Box
              sx={[
                (headCell.filter || (headCell.sort && activeOrderKey === headCell.orderKey)) && {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  ...(headCell.align === 'left' && { justifyContent: 'flex-start' }),
                  ...(headCell.align === 'center' && { justifyContent: 'center' })
                },
                { '&:hover': { cursor: headCell.sort ? 'pointer' : 'default' } }
              ]}>
              {headCell.label && (
                <Typography
                  sx={{ order: 1, textAlign: headCell.align }}
                  children={headCell.label}
                  variant="subtitle2"
                />
              )}
              {headCell.filter && <FilterIcon headCell={headCell} />}
              {headCell.sort && activeOrderKey === headCell.orderKey && (
                <OrderIcon resetSort={resetSort} headCell={headCell} />
              )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default MyTableHead;
