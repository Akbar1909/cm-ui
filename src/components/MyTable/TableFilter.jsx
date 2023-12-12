import { useContext, useRef, useMemo, useState } from 'react';
import { Box, Stack, FormLabel } from '@mui/material';
import { TableFilterContext } from 'contexts/TableFilterContext';
import { tableFilterStyles as styles } from './MyTable.styles';
import MyTextField from 'components/MyTextField';
import { useTranslation } from 'react-i18next';
import MyCheckbox from 'components/MyCheckbox';
import { TABLE_FILTER_ACTION_TYPES } from 'contexts/TableFilterContext/TableFilterProvider';
import { search } from 'utils/helpers';
import MyButton from 'components/MyButton';
import Spinner from 'components/Spinner';
import { useQueryClient } from '@tanstack/react-query';
import { useWidth } from 'hooks/useResponsive';
import MyDateRange from 'components/MyDateRange';
import MyOverlay from 'components/MyOverlay';

const TableFilterWrapper = ({ children }) => {
  const ref = useRef();
  const { t } = useTranslation();
  const { x, y, mode, sx, activeKey, filterDispatch, setTableFilter, handleApply, ...rest } =
    useContext(TableFilterContext);

  const breakpoint = useWidth();

  if (mode !== 'open') {
    return null;
  }

  const width = sx?.width?.[breakpoint] || sx?.width?.xs || 250;

  const isRight = x + width < window.innerWidth;

  const handleClose = () => setTableFilter({ mode: 'closed' });

  const left = isRight ? x + 5 : x - 5 - width;
  const top = y + window.scrollY + 5;

  const handleSearch = (e) => {
    filterDispatch({
      type: TABLE_FILTER_ACTION_TYPES.SET_SEARCH_VALUE,
      payload: { value: e.target.value }
    });
  };

  return (
    <>
      <Stack
        ref={ref}
        data-testid="table-filter"
        sx={[
          styles.root,
          {
            transform: 'none',
            left,
            top,
            transformOrigin: `${-top / 2}px ${left}px`
          },
          ...(Array.isArray(sx) ? sx : [sx])
        ]}>
        <FormLabel
          sx={[styles.header, { borderBottom: 'none', pb: 0 }]}
          children={rest.label}
          variant="subtitle2"
        />

        {rest?.[activeKey]?.headerSearch && (
          <Box data-testid="table-filter-header" sx={styles.header}>
            <MyTextField
              name={activeKey}
              size="small"
              placeholder={t('Search..')}
              onChange={handleSearch}
              value={rest?.[activeKey]?.search || ''}
            />
          </Box>
        )}
        <Box sx={styles.content} mb="auto">
          {children}
        </Box>
        <Stack
          mt="auto"
          columnGap={'8px'}
          direction="row"
          data-testid="table-filter-footer"
          alignItems="center"
          justifyContent="center"
          sx={styles.footer}>
          <MyButton onClick={handleClose}>{t('Close')}</MyButton>
          <MyButton onClick={handleApply} variant="outlined">
            {t('Apply')}
          </MyButton>
        </Stack>
      </Stack>

      <MyOverlay open handleClick={handleClose} />
    </>
  );
};

const MultipleCase = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { handleAll, ...context } = useContext(TableFilterContext);

  const activeKey = context.activeKey;
  const settings = context?.[activeKey];
  const { options, values: valuesMap, search: input } = settings;
  const queryState = queryClient.getQueryState(settings?.queryKey) || {
    status: 'success'
  };

  const renderOptions = useMemo(
    () => options.filter((option) => search(option.label, input)),
    [options, input]
  );

  const isTotal = renderOptions.every((option) => valuesMap && valuesMap.get(option.value));

  const handleChange = (value) => {
    const newMap = new Map(valuesMap);
    const newValue = !valuesMap.get(value);
    newMap.set(value, newValue);

    context.setTableFilter({
      [activeKey]: { ...settings, values: newMap }
    });
  };

  return (
    <Stack
      rowGap={'4px'}
      minHeight={'200px'}
      maxHeight={'300px'}
      overflow="auto"
      sx={{ '&:hover': { cursor: 'pointer' } }}>
      <MyCheckbox
        label={t('All')}
        size="small"
        checked={isTotal}
        onChange={() => handleAll(!isTotal)}
      />
      <Spinner loading={queryState.status === 'loading'}>
        {renderOptions.map(({ value, label, count }) => (
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            key={value}
            columnGap={'8px'}
            onClick={() => handleChange(value)}
            sx={{ cursor: 'pointer' }}>
            <MyCheckbox label={label} size="small" checked={valuesMap && valuesMap.get(value)} />

            {typeof count === 'number' && (
              <Box
                ml="auto"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={styles.badge}>
                {count}
              </Box>
            )}
          </Stack>
        ))}
      </Spinner>
    </Stack>
  );
};

const NumberComparisonCase = () => {
  const { activeKey, setToActiveKeyValues, ...rest } = useContext(TableFilterContext);

  const config = rest?.[activeKey];

  const handleChange = (e) => {
    setToActiveKeyValues({ [e.target.name]: e.target.value });
  };

  return (
    <Stack rowGap="8px">
      <MyTextField
        name={`${activeKey}Gte`}
        size="small"
        placeholder={'>='}
        onChange={handleChange}
        value={config?.values?.[`${activeKey}Gte`]}
        type="number"
      />

      <MyTextField
        name={`${activeKey}Lte`}
        size="small"
        placeholder={'<='}
        onChange={handleChange}
        value={config?.values?.[`${activeKey}Lte`]}
        type="number"
      />
    </Stack>
  );
};

const DateComparisonCase = () => {
  const [open, setOpen] = useState(false);
  const { activeKey, setToActiveKeyValues, ...rest } = useContext(TableFilterContext);

  const config = rest?.[activeKey];

  const lteName = `${activeKey}Lte`;
  const gteName = `${activeKey}Gte`;

  console.log(config);

  const handleSelectedSlotIndex = (index) => {
    setToActiveKeyValues({ selectedSlotIndex: index });
  };

  return (
    <Stack rowGap={'8px'} mb="16px" alignItems="center" justifyContent="center">
      <MyDateRange
        name={activeKey}
        open={open}
        setOpen={setOpen}
        onChange={([startDate, endDate]) => {
          if (startDate != null) {
            setToActiveKeyValues({ [gteName]: startDate });
          }

          if (endDate != null) {
            setToActiveKeyValues({ [lteName]: endDate });
          }
        }}
        startDate={config?.values?.[gteName]}
        endDate={config?.values?.[lteName]}
        handleSelectedSlotIndex={handleSelectedSlotIndex}
        selectedSlotIndex={config.values?.selectedSlotIndex}
      />
    </Stack>
  );
};

const SearchCase = () => {
  const { t } = useTranslation();
  const { activeKey, setTableFilter, handleSearch, ...rest } = useContext(TableFilterContext);

  return (
    <Box mb="16px">
      <MyTextField
        name={activeKey}
        size="small"
        placeholder={t('Search...')}
        onChange={handleSearch}
        value={rest[activeKey].value}
      />
    </Box>
  );
};

const TableFilter = () => {
  const { type } = useContext(TableFilterContext);

  switch (type) {
    case 'multiple':
      return (
        <TableFilterWrapper>
          <MultipleCase />
        </TableFilterWrapper>
      );
    case 'number-comparison':
      return (
        <TableFilterWrapper>
          <NumberComparisonCase />
        </TableFilterWrapper>
      );
    case 'date-comparison':
      return (
        <TableFilterWrapper>
          <DateComparisonCase />
        </TableFilterWrapper>
      );
    case 'search':
      return (
        <TableFilterWrapper>
          <SearchCase />
        </TableFilterWrapper>
      );

    default:
      return null;
  }
};

export default TableFilter;
