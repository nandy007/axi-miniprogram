


module.exports = {
  Page: function (opt) {
    Page(opt);
  },
  Component: function (opt) {
    opt.externalClasses = ['slot-class'];
    opt.options = {
      addGlobalClass: true
    };
    Component(opt);
  }
};