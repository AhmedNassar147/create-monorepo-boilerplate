/*
 *
 * `delayProcess`: `@domain/scripts`.
 *
 */
const delayProcess = (fn, options, ms) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(fn(options));
    }, +ms),
  );

module.exports = delayProcess;
