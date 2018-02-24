let Transforms = {
  config: null,
  apply: function (str) {
    let txt = str;
    this.config.transforms.forEach(function (transform) {
      let find = transform[0];
      let replace = transform[1];
      let flags = transform[2];
      txt = txt.replace(new RegExp(find, flags), replace);
    });
    return txt;
  }
};

export default Transforms;