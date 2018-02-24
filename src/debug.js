window.onerror = function (msg, url, l, c, ex) {
  notify(ex.stack, 'red');
  console.error(url + ':' + l);
  console.error(ex.stack);
  return true;
};

window.json = function ajax(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      dataType: 'json',
      data: data || {},
      success: (data) => {
        resolve(data);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};