import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';

export default function MyDatePicker({ label, error, helperText, ...props }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <DemoItem sx={{ pt: 0 }}>
        <DatePicker
          format="DD.MM.YYYY"
          label={label}
          slotProps={{
            textField: { error, helperText },
            layout: {
              sx: {
                [`.${pickersLayoutClasses.contentWrapper}`]: {
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
                  }
                }
              }
            }
          }}
          closeOnSelect={false}
          size="small"
          {...props}
        />
      </DemoItem>
    </LocalizationProvider>
  );
}
