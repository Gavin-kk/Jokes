export const getHoroscope = (date: number) => {
  const str: string = '865778999988';
  const c: string[] = [
    '摩羯',
    '水瓶',
    '双鱼',
    '白羊',
    '金牛',
    '双子',
    '巨蟹',
    '狮子',
    '处女',
    '天秤',
    '天蝎',
    '射手',
    '摩羯',
  ];
  const newData = new Date(date);
  const month = newData.getMonth() + 1;
  const day = newData.getDate();

  const startMonth = month - Number(day - 14 < +str.charAt(month));
  return `${c[startMonth]}座`;
};
