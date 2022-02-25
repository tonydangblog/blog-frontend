/* Now: Last Updated. */
import { format, formatDuration, intervalToDuration } from 'date-fns';

function getLastUpdatedDate(): number {
  // Get last updated date (in milliseconds) from DOM if present, else return zero.
  const nowLastUpdated = document.getElementById('now-last-updated');
  // eslint-disable-next-line dot-notation
  if (nowLastUpdated && nowLastUpdated.dataset['lastUpdated']) {
    // eslint-disable-next-line dot-notation
    return parseInt(nowLastUpdated.dataset['lastUpdated'], 10);
  }
  return 0;
}

function displayLastUpdated(): void {
  // Display last updated date.
  const nowLastUpdated = document.getElementById('now-last-updated');
  const formattedDate = getLastUpdatedDate()
    ? format(new Date(getLastUpdatedDate()), "MMMM do, y 'at' h:mm:ss bbb")
    : '';
  if (nowLastUpdated && formattedDate) {
    nowLastUpdated.innerHTML = `Last Updated: ${formattedDate}.`;
  }
}

function displayTimeSince(): void {
  // Display time since last update.
  const updated = getLastUpdatedDate();
  const nowTimeSince = document.getElementById('now-time-since');
  if (updated && nowTimeSince) {
    const duration = intervalToDuration({ start: new Date(updated), end: new Date() });
    const formattedDuration = formatDuration(duration, { delimiter: ',' });
    const durationArray = formattedDuration.split(',');
    let timeSince = '';
    if (durationArray[0] === '') {
      timeSince = '0 seconds';
    } else {
      durationArray.forEach((i: string, index: number): void => {
        if (durationArray.length > 1 && index + 1 === durationArray.length) {
          timeSince = `${timeSince} and ${i}`;
        } else if (timeSince) {
          timeSince = `${timeSince}, ${i}`;
        } else {
          timeSince = i;
        }
      });
    }
    nowTimeSince.innerHTML = `(Or exactly ${timeSince} ago)`;
  }
}

function incrementTimeSince(): void {
  // Increment time since last update in one second intervals.
  setInterval(displayTimeSince, 1000);
}

export { getLastUpdatedDate, displayLastUpdated, displayTimeSince, incrementTimeSince };
