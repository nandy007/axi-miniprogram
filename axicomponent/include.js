
function addCommon(opt, isPage){
  if (!opt.properties) opt.properties = {};
  var properties = opt.properties;

  // 处理显隐，需要组件跟节点绑定此属性变量，hidden="{{hidden}}"
  properties.hidden = {
    type: Boolean
  };


  // 处理双向绑定
  // v-model="variable" => modelValue="{{variable}}" modelName="variable" catchmodelupdate="modelupdate"
  if(opt.formType==='input'){
    properties.modelValue = {
      type: opt.formType || String,
      observer: function (newVal, oldVal) {
        this.data['value'] = newVal;
      }
    };
  } else if (opt.formType === 'select') {
    properties.modelValue = {
      type: opt.formType || String,
      observer: function (newVal, oldVal) {
        this.data['value'] = newVal;
      }
    };
  } else if (opt.formType === 'radio') {
    properties.modelValue = {
      type: opt.formType || String,
      observer: function (newVal, oldVal) {
        this.data['checked'] = newVal === this.data['value'];
      }
    };
  } else if (opt.formType === 'checkbox') {
    properties.modelValue = {
      type: Object,
      value: [],
      observer: function (newVal, oldVal) {
        var val = this.data['value'];
        this.data['checked'] = newVal.indexOf(val)>-1;
      }
    };
  }

  properties.modelName = {
    type: String
  };

  var methods = isPage ? opt : (function(){
    if(opt.methods) return opt.methods;
    return opt.methods = {};
  })();
  methods.modelupdate = function(e, params){
    var value = params.value, modelName = params.modelName, checked = params.checked;
    var modelNames = modelName.split('.'), lastName = modelNames.pop(), name, obj = this.data;
    
    while (name = modelNames.shift()){
      obj = obj[name];
    }

    if (obj[lastName] instanceof Array ){
      var index = obj[lastName].indexOf(value);
      if (checked){
        if (index===-1){
          obj[lastName].push(value);
        }
      }else{
        if (index>-1){
          var newArr = [], cur;
          while (cur = obj[lastName].pop()){
            if(cur!==value) newArr.push(cur);
          }
          obj[lastName] = newArr;
        }
      }
    }else{
      obj[lastName] = value;
    }

  }
}


module.exports = {
  Page: function (opt) {
    Page(opt);
  },
  Component: function (opt) {
    opt.externalClasses = ['slot-class'];
    opt.options = {
      addGlobalClass: true
    };
    addCommon(opt);
    Component(opt);
  }
};