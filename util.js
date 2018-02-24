module.exports = {
  padNum: function (num) {
    let str = num.toString();
    return str.length === 1 ? '0' + str : str;
  }
};