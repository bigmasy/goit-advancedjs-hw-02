import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

let selectedDate = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    selectedDate = selectedDates[0];
    validateDate(selectedDate);
  },
};

const fp = flatpickr('#datetime-picker', options);
const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');
startBtn.setAttribute('disabled', true);
startBtn.addEventListener('click', () => startTimer(selectedDate));

function validateDate(userDate) {
  const date = Date.now();
  if (date - userDate > 0) {
    iziToast.error({
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    startBtn.setAttribute('disabled', true);
  } else {
    startBtn.removeAttribute('disabled');
  }
}

let intervalId;

function startTimer(endDate) {
  intervalId = setInterval(() => {
    startBtn.setAttribute('disabled', true);
    dateInput.setAttribute('disabled', true);
    const now = Date.now();
    const delta = endDate - now;

    if (delta <= 0) {
      clearInterval(intervalId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateInput.removeAttribute('disabled');

      return;
    }

    const timeLeft = convertMs(delta);
    updateTimerDisplay(timeLeft);
  }, 1000);
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
