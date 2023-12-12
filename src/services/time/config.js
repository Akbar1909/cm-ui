import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as isLeapYear from 'dayjs/plugin/isLeapYear'; // import plugin
import 'dayjs/locale/zh-cn';

// import locale
dayjs.extend(isLeapYear); // use plugin
// dayjs.locale('zh-cn'); // use locale

dayjs.extend(utc);

export default dayjs;
