const formatTimer = function(date) {
  if (!date) {
    return '-';
  }
  date = new Date(date);
  let YY = date.getFullYear() + '-';
  let MM =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-';
  let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let hh =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let mm =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':';
  let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return YY + MM + DD + ' ' + hh + mm + ss;
};
const money = function(num) {
  if (num) {
    return (num / 100).toFixed(2);
  } else {
    return '0';
  }
}
export default {
  formatTimer,
  money
};
