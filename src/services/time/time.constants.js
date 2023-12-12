export const DATE_UI_FORMAT = 'DD.MM.YYYY';
export const DATE_UI_FORMAT_WITH_SLASH = 'DD/MM/YYYY';
export const TIME_24_FORMAT = 'HH:mm';
export const TIME_AM_PM = 'h:mm A';
export const FULL_DATE_UI_FORMAT = `${DATE_UI_FORMAT} ${TIME_24_FORMAT}`;

const createMonthOptions = () => {
  // Create an array to hold the months
  const formattedMonths = [];

  for (let month = 0; month < 12; month++) {
    const date = new Date(0, month); // Year 0 corresponds to 1900 in JavaScript Date objects
    const monthName = date.toLocaleString('default', { month: 'long' }); // Get the full month name
    const monthValue = month + 1; // Month values start from 1
    formattedMonths.push({
      label: monthName,
      value: monthValue
    });
  }

  return formattedMonths;
};

const generateYearOptions = (count = 3) => {
  const currentYear = new Date().getFullYear(); // Get the current year
  const yearOptions = [];

  for (let i = 0; i < count; i++) {
    const year = currentYear - i;
    yearOptions.push({ label: year, value: year });
  }

  return yearOptions;
};

const MONTH_OPTIONS = createMonthOptions();
const YEAR_OPTIONS = generateYearOptions();

export { MONTH_OPTIONS, YEAR_OPTIONS };
