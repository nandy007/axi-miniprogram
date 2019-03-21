// axicomponent/radio/axi-radio.js
const ComponentWrapper = require('../include.js')('axi-radio').Component;
const app = getApp();
function common(){
  
  var name = this.data.name;
  var comps = app.globalData.pageCache.name[name] || [];

  for(var i=0, len=comps.length;i<len;i++){
    var comp = comps[i];
    if(comp!==this && comp.data.checked===true) comp.common();
  }
}

ComponentWrapper({
  formType: 'radio',
  /**
   * 组件的属性列表
   */
  properties: {
    'value': {
      type: String
    },
    'disabled': {
      type: Boolean
    },
    'checked': {
      type: Boolean,
      value: false,
      observer: function (v, o) {
        this.triggerEvent('change', {
          checked: v,
          value: this.data.value
        });
        if(v) common.call(this);
      }
    },
    'color': {
      type: String
    },
    'name': {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    click: function(e){
      if(this.data.checked) return;
      this.setData({
        checked: true
      });
    },
    common: function(){
      this.setData({
        checked: false
      });
    }
  }
})
