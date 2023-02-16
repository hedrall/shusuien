const sleep = async (d: number) => {
  await new Promise(resolve => {
    setTimeout(resolve, d);
  });
};
export { DATE_TIME_FORMAT } from '@frontend/supports/date';
export { x日前の表記 } from '@frontend/supports/date';
