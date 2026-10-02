import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function formatDate(date) {
  return date ? dayjs(date).utc().format("YYYY年MM月DD日") : '';
}
