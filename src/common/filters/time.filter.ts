import moment from '@utils/moment.util';

const second: number = 1000;
const minute: number = second * 60;
const hour: number = minute * 60;
const day: number = hour * 24;
const month: number = day * 30;
const areaHour: number = hour * 8;

export const timeFilter = (time: string): string => {
  const newTime: number = moment(time).valueOf() - areaHour;
  const currentTime: number = new Date().getTime();
  const timeDifference: number = currentTime - moment(newTime).valueOf();

  switch (true) {
    case timeDifference > month:
      return moment(newTime).format('YYYY-MM-DD');
    case timeDifference > day:
      return moment(newTime).format('YYYY-MM-DD');
    case timeDifference > hour:
      return `${moment.duration(moment(currentTime).diff(newTime)).asHours().toFixed(0)}小时前`;
    case timeDifference > minute:
      return `${moment.duration(moment(currentTime).diff(newTime)).asMinutes().toFixed(0)}分钟前`;
    case timeDifference > second:
      // eslint-disable-next-line no-case-declarations
      const t: string = moment.duration(moment(currentTime).diff(newTime)).asMinutes().toFixed(0);
      return `${+t === 0 ? 1 : t}秒前`;
    case timeDifference < second:
      return '刚刚';
    default:
      return moment(newTime).format('YYYY-MM-DD hh:mm');
  }
};
