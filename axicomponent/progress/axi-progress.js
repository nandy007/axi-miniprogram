// axicomponent/progress/axi-progress.js
const ComponentWrapper = require('../include.js')('axi-progress').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'showInfo': {
      type: Boolean,
      value: false
    },
    'borderRadius': {
      type: Number,
      value: 0
    },
    'fontSize': {
      type: Number,
      value: 16
    },
    'strokeWidth': {
      type: Number,
      value: 6
    },
    'activeColor': {
      type: String,
      value: '#09BB07'
    },
    'backgroundColor': {
      type: String,
      value: '#bebebe'
    },
    'active': {

      type: Boolean,
      value: false
    },
    'activeMode': {
      type: String,
      value: 'backwards'
    },
    'percent': {
      type: Number,
      value: 0
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
    activeendFunc: function(e){
      this.triggerEvent('activeend', arguments);
    }
  }
})
