const calendarDaySelected = {
  backgroundColor: (theme) => theme.palette.primary.main,
  borderColor: 'transparent',
  borderRadius: '50%'
};

const calendarDayHoveredSpan = {
  backgroundColor: (theme) => '#3e3e4b',
  color: (theme) => theme.palette.common.white,
  borderColor: 'transparent'
};

const calendarDaySelectedSpan = {
  backgroundColor: (theme) => '#3e3e4b',
  color: (theme) => theme.palette.common.white,
  borderColor: 'transparent'
};

const myDateRangeStyles = {
  root: {
    '& input': {
      backgroundColor: 'common.picker.input',
      color: 'common.white'
    },
    '& .DateRangePicker_picker__directionRight': {
      zIndex: 10000
    },
    '& .DateRangePickerInput': {
      backgroundColor: 'common.picker.input',
      borderColor: '#63646B',
      '&:hover': {
        borderColor: (theme) => theme.palette.common.white
      }
    },
    '& .DateInput_input__focused': {
      borderColor: 'common.picker.background'
    },
    '& .DateInput_fangStroke': {
      fill: (theme) => theme.palette.common.picker.background,
      stroke: 'transparent'
    },
    '& .DayPicker': {
      backgroundColor: 'common.picker.background'
    },
    '& .DayPicker__withBorder': {
      boxShadow: 'none',
      borderRadius: '0px',
      height: '300px',
      '&>div': {
        height: '100%'
      }
    },
    '& .DayPicker_wrapper__horizontal': { height: '100%' },
    '& .DayPicker_transitionContainer': {
      borderRadius: '0px',
      backgroundColor: (theme) => theme.palette.background.default,
      height: '300px !important'
    },
    '& .CalendarMonthGrid': {
      backgroundColor: 'background.default',
      height: '100% !important'
    },
    '& .CalendarMonth': {
      backgroundColor: 'background.default'

      // '&:last-of-type': {
      //   pr: '0px !important'
      // }
    },
    '& table': {
      '& td': {
        backgroundColor: 'background.default',
        borderColor: 'transparent',
        color: 'common.white'
      }
    },

    '& .DayPickerNavigation_button__horizontalDefault': {
      py: '3px',
      px: '4px'
    },
    '& .DayPickerNavigation_button': {
      backgroundColor: 'common.picker.background',
      borderColor: 'transparent',
      '&:hover': {
        borderColor: 'transparent',
        opacity: 0.9
      },
      '&:active': {
        backgroundColor: 'common.picker.background'
      }
    },

    '& .CalendarMonthGrid_month__horizontal': {},
    // '& .CalendarMonthGrid__horizontal': {
    //   left: '0px'
    // },

    '& .CalendarMonth_caption': {
      pt: '17px',
      color: 'common.white'
    },
    '& .CalendarDay__default': {
      '&:hover': {
        backgroundColor: (theme) => '#3e3e4b',
        borderColor: 'transparent'
      }
    },
    '& .CalendarDay__selected': {
      ...calendarDaySelected,
      '&:hover': {
        ...calendarDaySelected,
        opacity: 0.9
      },
      '&:active': {
        ...calendarDaySelected,
        opacity: 0.9
      }
    },
    '& .CalendarDay__hovered_span': {
      ...calendarDayHoveredSpan,
      '&:hover': {
        ...calendarDayHoveredSpan
        // opacity: 0.9
      }
    },
    '& .CalendarDay__selected_span': {
      ...calendarDaySelectedSpan,
      '&:hover': {
        ...calendarDaySelectedSpan
        // opacity: 0.9
      }
    }
  },
  button: {
    width: 120,
    height: 32,
    borderRadius: '5px',
    backgroundColor: 'background.default',
    cursor: 'pointer'
  }
};

export default myDateRangeStyles;
