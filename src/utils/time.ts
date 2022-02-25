/* Utils: Time. */
function addDaysToDate(dateParam: number | string, days: number): Date {
  /* Create a JS Date object and add specified number of days. */
  const dateObject = new Date(dateParam);
  dateObject.setDate(dateObject.getDate() + days);
  return dateObject;
}

function secondsToString(seconds: number): string {
  /* Covert seconds to string format. */
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds - hrs * 3600) / 60);
  const secs = Math.round(seconds - hrs * 3600 - mins * 60);
  const h = `${hrs}`;
  let m = `${mins}`;
  let s = `${secs}`;

  if (secs < 10) s = `0${secs}`;
  if (seconds < 3600) return `${m}:${s}`;
  if (mins < 10) m = `0${mins}`;
  return `${h}:${m}:${s}`;
}

function sleep(milliseconds: number): Promise<void> {
  /* Suspend execution of script for given milliseconds in async function. */
  return new Promise<void>((resolve: Function): number =>
    setTimeout(resolve, milliseconds)
  );
}

export { addDaysToDate, secondsToString, sleep };
