import type {WorkDays, CalendarDays, WorkTime} from '~/store/query/brand';

interface WorkDay extends WorkTime {
  day: string;
}

const weekDays: CalendarDays[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

export const getWorkingDaysFromWeekDays = (workTime?: WorkDays): string => {
  if (!workTime) {
    return '';
  }
  const sortedTimes: WorkDay[] = [];

  weekDays.forEach(item => {
    sortedTimes.push({day: item, ...workTime[item]});
  });

  let firstPart = '';
  let secondPart = '';
  let workingTime = '';
  for (let index = 0; index < sortedTimes.length; index++) {
    const item = sortedTimes[index];
    if (!firstPart) {
      if (item.work) {
        firstPart = item.day;
        workingTime = `${item.from}-${item.to}`;
      }
    } else {
      if (item.work) {
        secondPart = ` - ${item.day}`;
      }
    }
  }
  return `${firstPart}${secondPart} ${workingTime}`;
};
