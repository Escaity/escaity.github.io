import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from "dayjs/plugin/utc";

dayjs.extend(advancedFormat)
dayjs.extend(utc);

export function formatDate(date) {
  if (date) {
    return dayjs(date).utc().format("YYYY年MM月DD日");
  } else {
    return ''
  }
}
