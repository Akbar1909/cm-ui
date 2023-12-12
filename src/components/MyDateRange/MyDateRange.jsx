import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { dayjs } from 'services/time';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import MyTextField from 'components/MyTextField';

const today = dayjs();

const clearMenuListActiveStyle = () => {
  const el = document.getElementsByClassName('MuiPickersLayout-root')[0];

  if (!el) {
    return;
  }

  el.children[0].childNodes.forEach((el) => {
    el.childNodes[0].classList.remove('date-range-active');
  });
};

const applySelectedStyleToSlotItem = (index) => {
  try {
    const el = document.getElementsByClassName('MuiPickersLayout-root')[0];

    console.log({ el });

    if (!el) {
      return;
    }

    el.children[0].childNodes[index].firstChild.classList.add('date-range-active');
  } catch (e) {
    console.log(e);
  }
};

export default function BasicDateRangePicker({
  onChange,
  open,
  startDate,
  endDate,
  setOpen,
  handleSelectedSlotIndex,
  selectedSlotIndex
}) {
  const { t } = useTranslation();
  const popupRef = useRef(null);
  const buttons = [
    {
      label: t('Today'),
      getValue: () => [today.startOf('day'), today],
      id: 'today'
    },
    {
      label: t('Last 3 days'),
      getValue: () => [today.subtract(2, 'day'), today],
      id: 'last-3-days'
    },
    {
      label: t('Last 7 days'),
      getValue: () => [today.subtract(6, 'day'), today],
      id: 'last-7-days'
    },
    {
      label: t('Last month'),
      getValue: () => [
        today.subtract(1, 'month').startOf('month'),
        today.subtract(1, 'month').endOf('month')
      ],
      id: 'last-month'
    },
    {
      label: t('Last 3 month'),
      getValue: () => [
        today.subtract(3, 'month').startOf('month'),
        today.subtract(1, 'month').endOf('month')
      ],
      id: 'last-3-month'
    },
    {
      label: t('Last year'),
      getValue: () => [
        today.subtract(1, 'year').startOf('year'),
        today.subtract(1, 'year').endOf('year')
      ],
      id: 'last-year'
    }
  ];

  console.log({ selectedSlotIndex });

  useEffect(() => {
    console.log({ open, selectedSlotIndex });
    if (!open) {
      return;
    }

    setTimeout(() => {
      applySelectedStyleToSlotItem(selectedSlotIndex);
    }, 0);
  }, [selectedSlotIndex, open]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        data-testid="range"
        sx={{
          '&>.MuiTextField-root ': {
            minWidth: '0px !important'
          },
          '&.MuiStack-root': {
            width: '100%'
          }
        }}
        components={['SingleInputDateRangeField']}>
        <DateRangePicker
          closeOnSelect={false}
          open={open}
          ref={popupRef}
          onClose={(...rest) => {
            setOpen && setOpen(false);
          }}
          slotProps={{
            shortcuts: {
              items: buttons,
              onClick: (e) => {
                const { target } = e;

                clearMenuListActiveStyle();

                const i = buttons.findIndex((button) => button.label === target.textContent);

                handleSelectedSlotIndex(i);

                applySelectedStyleToSlotItem(i);
              }
            },
            textField: {
              size: 'small',
              onClick: () => {
                setOpen(!open);
              }
            },

            layout: {
              sx: {
                '&.MuiPickersLayout-root': {
                  height: 325
                },
                '& .MuiDateRangeCalendar-monthContainer': { height: 325 },
                '&>.MuiDateCalendar-root': {
                  width: 300,
                  height: 300
                },
                '& .MuiYearCalendar-root': {
                  width: 300,
                  height: 300
                },

                '& .MuiPickersDay-root': {
                  width: 32,
                  height: 32
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  width: 32,
                  height: 34
                },
                '& .MuiPickersCalendarHeader-root': {
                  pl: '35px',
                  pr: '20px'
                },
                '& .MuiList-root': {
                  gridColumn: 2,
                  gridRow: 2,
                  pt: '16px',
                  '&>li': {
                    '&>div': {
                      width: '100%'
                    }
                  }
                },
                '& .MuiPickersLayout-contentWrapper': {
                  gridColumn: 1,
                  gridRow: '2/3'
                }
              }
            }
          }}
          onChange={onChange}
          format="DD.MM.YYYY"
          value={[startDate || null, endDate || null]}
          slots={{
            field: SingleInputDateRangeField,
            textField: MyTextField
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
