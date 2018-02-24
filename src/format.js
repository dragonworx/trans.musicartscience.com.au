export default {
  toCurrency: function (num) {
    let str = Math.round(num).toString();
    return str.charAt(0) === '-' ? '-$' + str.replace('-', '') : '$' + str;
  },
  date: function (date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}