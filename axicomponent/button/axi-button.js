// axicomponent/view/axi-view.js
const ComponentWrapper = require('../include.js').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'size': {
      type: String
    },
    'type': {
      type: String
    },
    'plain': {
      type: Boolean
    },
    'disabled': {
      type: Boolean
    },
    'loading': {
      type: Boolean
    },
    'hoverClass': {
      type: String
    },
    'hoverStopPropagation': {
      type: Boolean
    },
    'hoverStartTime'
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
    // toDo: function(){

    // }
  }
})
