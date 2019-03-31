// axicomponent/view/axi-view.js
const ComponentWrapper = require('../include.js')('axi-button').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'text': {
      type: String
    },
    'size': {
      type: String,
    },
    'type': {
      type: String,
    },
    'plain': {
      type: Boolean
    },
    'disabled': {
      type: Boolean
    },
    'loading': {
      type: Boolean,
      value: false
    },
    'hoverClass': {
      type: String
    },
    'hoverStopPropagation': {
      type: Boolean
    },
    'hoverStartTime':{
      type: Number,
      value: 20
    },
    'hoverStayTime': {
      type: Number,
      value: 70
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
    // toDo: function(){

    // }
  }
})
