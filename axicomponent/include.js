
const app = getApp();


function delay(cb){
  var delayTime = 50;
  setTimeout(function(){
    cb();
  }, delayTime);
}

function createPageCache(ctx) {
  var _names = {}, _all = [], _models = {};
  var _idCache = {};
  
  var util = {
    name: function(name, comp, isDel){
      _names[name] = _names[name] || [];
      if (isDel){
        var index = _names[name].indexOf(comp);
        if (index > -1) _names[name].splice(index, 1);
      } else if (comp){
        _names[name].push(comp);
      } else {
        return (_names[name] || []).slice(0);
      }
    },
    all: function (comp, isDel) {
      if (isDel){
        var index = _all.indexOf(comp);
        if (index > -1) _all.splice(index, 1);
      } else if (comp) {
        _all.push(comp);
      } else {
        return _all.slice(0);
      }
    },
    selectById: function(id){
      // 先从页面找
      var comp = ctx.selectComponent('#'+id);
      if (comp) return comp;
      // 页面没有则从缓存里找
      if (idCache[id]) return idCache[id];
      // 缓存没有则从所有组件找
      var all = util.all();
      for(var i=0, len=all.length;i<len;i++){
        comp = all[i].selectComponent('#' + id);
        if (comp) {
          // 找到存入缓存，并结束查找
          idCache[id] = comp;
          break;
        }
      }
      return comp;
    },
    selectByName: function(name){
      return util.name(name);
    },
    selectBySelector: function(selector){
      // 先找页面
      var comps = Array.prototype.slice.call(ctx.selectAllComponents(selector));
      // if (!isDeep) return comps; 
      // 再找组件内
      var all = util.all();
      for (var i = 0, len = all.length; i < len; i++) {
        comp = all[i].selectAllComponents(selector);
        comps = comps.concat(Array.prototype.slice.call(comp));
      }
      return comps;
    },
    setData: function(){
      ctx.setData.apply(ctx, arguments);
    },
    registerModel: function(exp, cb){
      var cbs = _models[exp] = _models[exp] || [];
      cbs.push(cb);
      return this.getValueFromModel(exp);
    },
    getValueFromModel: function(exp){
      var cur, exps = exp.split('.'), e, data = ctx.data;
      while(e = exps.shift()){
        cur = data[e];
      }
      return cur;
    },
    updateModel: function(exp, val){
      var obj = {};
      obj[exp] = val;
      ctx.setData(obj, true);
    },
    triggerModelUpdate: function(exp, v){
      var cbs = _models[exp] = _models[exp] || [];
      cbs.forEach((cb)=>{
        cb(v);
      });
    }
  };

  return util;
}

function addPageLifetimes(opt) {
  var onLoad = opt.onLoad;
  opt.onLoad = function() {
    var pageCache = this.pageCache = app.globalData.pageCache = createPageCache(this);
    
    // 重写page的setData
    var setData = this.setData;
    this.setData = function (data, noTrigger) {
      if (!noTrigger){
        for (var exp in data) {
          pageCache.triggerModelUpdate(exp, data[exp]);
        }
      }
      setData.apply(this, arguments);
    };

    onLoad && onLoad.call(this);
  };
  var events = ['onShow', 'onUnload'];

  events.forEach((name)=>{
    var func = events[name];
    opt[name] = function(){
      app.globalData.pageCache = this.pageCache;
      func && func.apply(this, arguments);
    }
  });

}

function addCompLifetimes(opt) {
  var detached = opt.detached;
  opt.detached = function() {
    var pageCache = app.globalData.pageCache;

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
  opt.created = function(){
    var pageCache = app.globalData.pageCache;
    pageCache.all(this);
    
    // 重写comp的triggerEvent
    var triggerEvent = this.triggerEvent;
    this.triggerEvent = function (name, params) {
      triggerEvent.apply(this, arguments);
      if (['input', 'blur', 'change'].indexOf(name) > -1) {
        this.__modelHandler && this.__modelHandler(params||{});
      }
    };

    created && created.call(this);
  };

  var events = ['created', 'attatched'];
  events.forEach((name)=>{
    var func = opt[name];
    if(func) opt[name] = function(){
      var args = arguments;
      delay(() => {
        func.apply(this, args);
      });
    };
  });
}

function getMethods(opt, isPage){
  var methods = isPage ? opt : (function () {
    return opt.methods = opt.methods || {};
  })();
  return methods;
}

function addMethods(opt, isPage){
  var methods = getMethods(opt, isPage);

  methods.selectById = function(id){
    var pageCache = app.globalData.pageCache;
    var comp = pageCache.selectById(id);
    return comp;
  };
  methods.selectByName = function (name) {
    var pageCache = app.globalData.pageCache;
    var comps = pageCache.selectByName();
    return comps;
  };
  methods.selectBySelector = function(selector, isFirst){
    var pageCache = app.globalData.pageCache;
    var comps = pageCache.selectBySelector(selector);
    return isFirst ? comps[0] : comps;
  };
  methods.getAttrValue = function(attrName){
    return this.data[attrName];
  };
}

function addValueOberser(opt) {

  var properties = opt.properties = opt.properties || {};

  // 添加name属性监听
  var nameProperty = properties.name = properties.name || {type: 'String'};
  var nameObserver = nameProperty.observer;
  nameProperty.observer = function(v, o){
    if (!v) return;
    var pageCache = app.globalData.pageCache, attr = 'name';

    var vObj = pageCache[attr][v] = pageCache[attr][v] || [],
      oObj = pageCache[attr][o] || [],
      index;

    index = oObj.indexOf(this);
    if (index > -1) {
      oObj.splice(index, 1);
    }
    index = vObj.indexOf(this);
    if (index === -1) {
      vObj.push(this);
    }
    nameObserver && nameObserver.apply(this, arguments);
  };

  
  var attrs = Object.keys(properties||{});

  // 为所有的属性添加延迟触发
  attrs.forEach((attr) => {
    
    var property = properties[attr];

    var observer = property.observer;

    if (!observer) return;

    property.observer = function() {
      var args = arguments;
      // 延迟触发，确保page的onload先进入
      delay(() => {
        observer.apply(this, args);
      });
    }

  });
}


function bindModelHandler(opt){

  var properties = opt.properties = opt.properties || {};

  var models = {
    text: {
      init: function(){
        var pageCache = app.globalData.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.data[comp.__modelAttrName], function(n){
          comp.setData({
            value: n
          });
        });

        comp.setData({
          value: modelVal
        });
      },
      handler: function (params){
        var pageCache = app.globalData.pageCache, comp = this;
        var modelAttrName = comp.__modelAttrName;
        var exp = comp.data[modelAttrName];
        pageCache.updateModel(exp, params.value);
      }
    },
    checkbox: {
      init: function(){
        var pageCache = app.globalData.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.data[comp.__modelAttrName], function (n) {
          comp.setData({
            checked: n.indexOf(comp.data.value) > -1
          });
        });


        comp.setData({
          checked: modelVal.indexOf(comp.data.value) > -1
        });
      },
      handler: function (params){
        var pageCache = app.globalData.pageCache, comp = this;
        var modelAttrName = comp.__modelAttrName;
        var exp = comp.data[modelAttrName], modelValue = pageCache.getValueFromModel(exp).slice(0);
        if(params.checked){
          if (modelValue.indexOf(params.value) < 0) modelValue.push(params.value);
        }else{
          var index = modelValue.indexOf(params.value);
          if (index>-1) modelValue.splice(index, 1);
        }
        pageCache.updateModel(exp, modelValue);
      }
    },
    radio: {
      init: function(){
        var pageCache = app.globalData.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.data[comp.__modelAttrName], function (n) {
          comp.setData({
            checked: n===comp.data.value
          });
        });

        comp.setData({
          checked: modelVal === comp.data.value
        });
      },
      handler: function (params){
       
        if(!params.checked) return;
        var pageCache = app.globalData.pageCache, comp = this;
        var modelAttrName = comp.__modelAttrName;
        var exp = comp.data[modelAttrName];
        
        pageCache.updateModel(exp, params.value);
      }
    },
    select: {
      init: function(){
        var pageCache = app.globalData.pageCache, comp = this;

        var modelVal = pageCache.registerModel(comp.data[comp.__modelAttrName], function (n) {
          comp.setData({
            value: n
          });
        });

        comp.setData({
          value: modelVal
        });
      },
      handler: function(params){
        var pageCache = app.globalData.pageCache, comp = this;
        var modelAttrName = comp.__modelAttrName;
        var exp = comp.data[modelAttrName];
        pageCache.updateModel(exp, params.value);
      }
    }
  };

  for (var k in models){

    (function(type){
      var modelUtil = models[type];
      var modelAttrName = 'v-model:' + type;
      properties[modelAttrName] = {
        type: String,
        observer: function (v, n) {
          if(!v) return;
          if (!this.__modelInit) {

            var comp = this;
            this.__modelAttrName = modelAttrName;
            this.__modelHandler = function(params){
              modelUtil.handler && modelUtil.handler.call(comp, params);
            };

            modelUtil.init && modelUtil.init.call(this);

            this.__modelInit = false;
          }
        }
      }

    })(k);
    
  }

  
}



module.exports = function(tagName){
  return {
    Page: function (opt) {
      addPageLifetimes(opt);
      addMethods(opt);
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