/*
 *
 * `debounce`: `scripts`.
 *
 */
const debounce = (fn, timeout = 200) => {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), timeout);
  };
};

module.exports = debounce;
