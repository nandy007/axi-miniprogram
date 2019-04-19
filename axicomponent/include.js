
const util = {
  get app() {
    return getApp();
  }
};

function delay(cb) {
  var delayTime = 50;
  setTimeout(function () {
    cb();
  }, delayTime);
}

function createPageCache(ctx, pageParams) {
  var _names = {}, _all = [], _models = {};
  var _idCache = {};

  var util = {
    getPageParams: function () {
      return pageParams;
    },
    name: function (name, comp, isDel) {
      _names[name] = _names[name] || [];
      if (isDel) {
        var index = _names[name].indexOf(comp);
        if (index > -1) _names[name].splice(index, 1);
      } else if (comp) {
        if (_names[name].indexOf(comp) === -1) _names[name].push(comp);
      } else {
        return (_names[name] || []).slice(0);
      }
    },
    all: function (comp, isDel) {
      if (isDel) {
        var index = _all.indexOf(comp);
        if (index > -1) _all.splice(index, 1);
      } else if (comp) {
        _all.push(comp);
      } else {
        return _all.slice(0);
      }
    },
    selectById: function (id) {
      // 先从页面找
      var comp = ctx.selectComponent('#' + id);
      if (comp) return comp;
      // 页面没有则从缓存里找
      if (idCache[id]) return idCache[id];
      // 缓存没有则从所有组件找
      var all = util.all();
      for (var i = 0, len = all.length; i < len; i++) {
        comp = all[i].selectComponent('#' + id);
        if (comp) {
          // 找到存入缓存，并结束查找
          idCache[id] = comp;
          break;
        }
      }
      return comp;
    },
    selectByName: function (name) {
      return util.name(name);
    },
    selectBySelector: function (selector, isFirst) {
      // 先找页面
      var comps = Array.prototype.slice.call(ctx.selectAllComponents(selector));
      // if (!isDeep) return comps; 
      // 再找组件内
      var all = util.all();
      for (var i = 0, len = all.length; i < len; i++) {
        comp = all[i].selectAllComponents(selector);
        comps = comps.concat(Array.prototype.slice.call(comp));
      }
      return isFirst ? comps[0] : comps;
    },
    getValueByName(name) {
      var comps = this.selectByName(name) || [], rs = '';
      for (var i = 0, len = comps.length; i < len; i++) {
        if (comps[i].data.checked) {
          rs = comps[i].data.value;
          break;
        }
      }
      return rs;
    },
    getValuesByName(name) {
      var comps = this.selectByName(name) || [], rs = [];
      for (var i = 0, len = comps.length; i < len; i++) {
        if (comps[i].data.checked) {
          rs.push(comps[i].data.value);
        }
      }
      return rs;
    },
    setData: function () {
      ctx.setData.apply(ctx, arguments);
    },
    registerModel: function (modelInfo, cb) {
      var models = _models[modelInfo.exp] = _models[modelInfo.exp] || [];
      if (models.indexOf(modelInfo) === -1) {
        modelInfo.cb = cb;
        models.push(modelInfo);
      }
      return this.getValueFromModel(modelInfo);
    },
    getModelCtx: function (modelInfo) {
      return modelInfo.source ? util.selectById(modelInfo.source) : ctx;
    },
    getValueFromModel: function (modelInfo) {
      var exps = modelInfo.exp.split('.'), e, comp = util.getModelCtx(modelInfo), data = comp.data, cur;
      while (e = exps.shift()) {
        cur = (cur || data)[e];
      }
      return cur;
    },
    updateModel: function (modelInfo, val) {
      var comp = util.getModelCtx(modelInfo);
      var obj = {};
      obj[modelInfo.exp] = val;
      comp.setData(obj, true);
    },
    triggerModelUpdate: function (exp, v, comp) {
      comp = comp || ctx;
      var models = _models[exp] = _models[exp] || [];
      models.forEach((modelInfo) => {
        var target = util.getModelCtx(modelInfo);
        if (target === comp) modelInfo.cb && modelInfo.cb(v);

      });
    },
    handlerObservers: function (ctx, keyArr) {
      if (keyArr.length === 0) return;
      var observers = ctx.observers;
      if (!observers) return;
      for (var k in observers) {
        var ks = k.replace(/ /g, '').split(','), flag = false;
        for (var i = 0, len = keyArr.length; i < len; i++) {
          if (ks.indexOf(keyArr[i]) > -1) {
            flag = true;
            break;
          }
        }
        if (flag) {
          observers[k].apply(ctx);
        }
      }
    }
  };

  return util;
}

function addPageLifetimes(opt) {
  var onLoad = opt.onLoad;
  opt.onLoad = function (options) {
    var pageCache = this.pageCache = util.app.globalData.__framework.pageCache = createPageCache(this, options);

    // 重写page的setData
    var setData = this.setData;
    this.setData = function (data, noTrigger) {
      var keyArr = [];
      for (var exp in data) {
        keyArr.push(exp);
        if (!noTrigger) pageCache.triggerModelUpdate(exp, data[exp]);
      }
      setData.apply(this, arguments);
      if (keyArr.length > 0) pageCache.handlerObservers(this, keyArr);
    };

    onLoad && onLoad.call(this);
  };
  var events = ['onShow', 'onUnload'];

  events.forEach((name) => {
    var func = events[name];
    opt[name] = function () {
      util.app.globalData.__framework.pageCache = this.pageCache;
      func && func.apply(this, arguments);
    }
  });

}

function addCompLifetimes(opt) {
  var detached = opt.detached;
  opt.detached = function () {
    var pageCache = util.app.globalData.__framework.pageCache;

    // 将组件从names缓存中清除
    var attrs = ['name'];
    var nameVal = this.data.name;
    if (nameVal) {
      pageCache.name(nameVal, this, true);
    }

    // 将组件从all缓存中清除
    pageCache.all(this, true);

    detached && detached.call(this);

  };

  var created = opt.created;
  opt.created = function () {
    var pageCache = util.app.globalData.__framework.pageCache;
    pageCache.all(this);

    // 重写comp的triggerEvent
    var triggerEvent = this.triggerEvent;
    this.triggerEvent = function (name, params) {
      triggerEvent.apply(this, arguments);
      if (['input', 'blur', 'change'].indexOf(name) > -1) {
        this.__modelInfo && this.__modelInfo.handler && this.__modelInfo.handler(params || {});
      }
    };

    // 重写page的setData
    var setData = this.setData;
    this.setData = function (data, noTrigger) {
      if (!noTrigger) {
        for (var exp in data) {
          pageCache.triggerModelUpdate(exp, data[exp], this);
        }
      }
      setData.apply(this, arguments);
    };

    created && created.call(this);
  };

  var events = ['created', 'attatched'];
  events.forEach((name) => {
    var func = opt[name];
    if (func) opt[name] = function () {
      var args = arguments;
      delay(() => {
        func.apply(this, args);
      });
    };
  });
}

function getMethods(opt, isPage) {
  var methods = isPage ? opt : (function () {
    return opt.methods = opt.methods || {};
  })();
  if (isPage && opt.methods) {
    for (var k in opt.methods) {
      (function (k) {
        var old = opt[k];
        opt[k] = function () {
          old && old.apply(this, arguments);
          return opt.methods[k].apply(this, arguments);
        };
      })(k);
    }
  }
  return methods;
}

function addMethods(opt, isPage) {
  var methods = getMethods(opt, isPage);

  var methodNames = ['selectById', 'selectByName', 'selectBySelector', 'getValueByName', 'getValuesByName'];

  methodNames.forEach((methodName) => {
    methods[methodName] = function () {
      var pageCache = util.app.globalData.__framework.pageCache;
      return pageCache[methodName].apply(pageCache, arguments);
    };
  });

  methods.getAttrValue = function (attrName) {
    return this.data[attrName];
  };
}

function addValueOberser(opt) {

  var properties = opt.properties = opt.properties || {};

  // 添加name属性监听
  var nameProperty = properties.name = properties.name || { type: 'String' };
  var nameObserver = nameProperty.observer;
  nameProperty.observer = function (v, o) {
    var pageCache = util.app.globalData.__framework.pageCache;
    if (o) {
      // 删除原缓存
      pageCache.name(o, this, true);
    }
    if (v) {
      // 添加新缓存
      pageCache.name(v, this);
    }

    nameObserver && nameObserver.apply(this, arguments);
  };


  var attrs = Object.keys(properties || {});

  // 为所有的属性添加延迟触发
  attrs.forEach((attr) => {

    var property = properties[attr];

    var observer = property.observer;

    if (!observer) return;

    property.observer = function () {
      var args = arguments;
      // 延迟触发，确保page的onload先进入
      delay(() => {
        observer.apply(this, args);
      });
    }

  });
}


function bindModelHandler(opt) {

  var properties = opt.properties = opt.properties || {};

  var models = {
    text: {
      init: function () {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.__modelInfo, function (n) {
          comp.setData({
            value: n
          });
        });

        comp.setData({
          value: modelVal
        });
      },
      handler: function (params) {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this, modelInfo = comp.__modelInfo;
        var modelAttrName = modelInfo.attr;
        // var exp = comp.data[modelAttrName];
        pageCache.updateModel(modelInfo, params.value);
      }
    },
    checkbox: {
      init: function () {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.__modelInfo, function (n) {
          comp.setData({
            checked: n.indexOf(comp.data.value) > -1
          });
        });


        comp.setData({
          checked: modelVal.indexOf(comp.data.value) > -1
        });
      },
      handler: function (params) {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this, modelInfo = comp.__modelInfo;
        var modelAttrName = modelInfo.attr;
        // var exp = comp.data[modelAttrName];
        var modelValue = pageCache.getValueFromModel(modelInfo).slice(0);
        if (params.checked) {
          if (modelValue.indexOf(params.value) < 0) modelValue.push(params.value);
        } else {
          var index = modelValue.indexOf(params.value);
          if (index > -1) modelValue.splice(index, 1);
        }
        pageCache.updateModel(modelInfo, modelValue);
      }
    },
    radio: {
      init: function () {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.__modelInfo, function (n) {
          comp.setData({
            checked: n === comp.data.value
          });
        });

        comp.setData({
          checked: modelVal === comp.data.value
        });
      },
      handler: function (params) {

        if (!params.checked) return;
        var pageCache = util.app.globalData.__framework.pageCache, comp = this, modelInfo = comp.__modelInfo;
        var modelAttrName = modelInfo.attr;
        // var exp = comp.data[modelAttrName];

        pageCache.updateModel(modelInfo, params.value);
      }
    },
    select: {
      init: function () {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.__modelInfo, function (n) {
          comp.setData({
            value: n
          });
        });

        comp.setData({
          value: modelVal
        });
      },
      handler: function (params) {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this, modelInfo = comp.__modelInfo;
        var modelAttrName = modelInfo.attr;
        // var exp = comp.data[modelAttrName];
        pageCache.updateModel(modelInfo, params.value);
      }
    },
    'switch': {
      init: function () {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.__modelInfo, function (n) {
          comp.setData({
            checked: !!n
          });
        });

        comp.setData({
          checked: !!modelVal
        });
      },
      handler: function (params) {
        var pageCache = util.app.globalData.__framework.pageCache, comp = this, modelInfo = comp.__modelInfo;
        var modelAttrName = modelInfo.attr;
        // var exp = comp.data[modelAttrName];
        pageCache.updateModel(modelInfo, params.value);
      }
    }
  };

  for (var k in models) {

    (function (type) {
      var modelUtil = models[type];
      var modelAttrName = 'v-model:' + type;
      properties[modelAttrName] = {
        type: String,
        observer: function (v, o) {
          if (!v) return;
          if (!this.__modelInfo) {
            var comp = this;
            var modelInfo = {
              attr: modelAttrName,
              get source() {
                return comp.data.modelFrom;
              },
              exp: v,
              handler: function (params) {
                modelUtil.handler && modelUtil.handler.call(comp, params);
              }
            };
            this.__modelInfo = modelInfo;

            this.__modelUtil = modelUtil;

            modelUtil.init && modelUtil.init.call(this);
          }
        }
      }

    })(k);

  }

  // modelFrom属性指明该model的值来源，为来源组件的id，若不指定则来源于当前页
  properties.modelFrom = {
    type: String,
    observer: function (v, o) {
      var modelUtil = this.__modelUtil;
      if (modelUtil) {
        // 当绑定id变化时，重新注册
        modelUtil.init && modelUtil.init.call(this);
      }
    }
  };

}



module.exports = function (tagName) {
  return {
    Page: function (opt) {
      addPageLifetimes(opt);
      addMethods(opt, true);
      Page(opt);
    },
    Component: function (opt) {
      opt.tagName = tagName;
      opt.externalClasses = ['slot-class'];
      opt.options = {
        addGlobalClass: true
      };
      addCompLifetimes(opt);
      bindModelHandler(opt);
      addValueOberser(opt);
      addMethods(opt);
      Component(opt);
    }
  }
};