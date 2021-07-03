export const handleNumber = (num: number): string => {
  const centerNum: (n: number) => number = (n: number) => +(num / n).toFixed(2);

  switch (true) {
    case num > 1000 && num < 10000:
      return `${centerNum(1000)}千`;
    case num > 10000 && num < 1000000:
      return `${centerNum(10000)}万`;
    case num > 1000000 && num < 10000000:
      return `${centerNum(1000000)}百万`;
    case num > 10000000 && num < 100000000:
      return `${centerNum(10000000)}千万`;
    case num > 100000000 && num < 1000000000:
      return `${centerNum(100000000)}亿`;
    default:
      return `${num}`;
  }
};
