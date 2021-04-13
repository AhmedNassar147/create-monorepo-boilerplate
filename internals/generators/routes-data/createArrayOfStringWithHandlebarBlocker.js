/*
 *
 * createArrayOfStringWithHandlebarBlocker: `utils`.
 *
 */
function createArrayOfStringWithHandlebarBlocker(value, separator) {
  let pageParams = [];

  if (separator && value.includes(separator)) {
    pageParams = value.split(separator);
  } else {
    const isTypeString = typeof value === "string";
    pageParams = isTypeString ? [value] : value;
  }

  const length = pageParams.length;

  return pageParams.map((key, index) =>
    length - 1 !== index ? `"${key}",` : `"${key}"`,
  );
}

module.exports = createArrayOfStringWithHandlebarBlocker;
