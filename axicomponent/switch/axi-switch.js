// axicomponent/switch/axi-switch.js
const ComponentWrapper = require('../include.js').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'checked': {
      //memo: 是否选中
      type: Boolean
    },
    'color': {
      //memo: 'switch 的颜色，同 css 的 color'
      type: Boolean
    },
    'disabled': {
      //memo: 是否禁用
      type: Boolean
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
    changeFunc: function(e) {
      this.triggerEvent('change', arguments);
    }
  }
})
