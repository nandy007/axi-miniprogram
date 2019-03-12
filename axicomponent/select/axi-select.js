// axicomponent/select/axi-select.js
const ComponentWrapper = require('../include.js').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'value': {
        // memo: 'value 的值表示选择了 range 中的第几个（下标从 0 开始）',
        type: String
    },
    'disabled': {
        // memo: '是否禁用',
        type: Boolean
    },
    'range': {
        // memo: 'mode为 selector 或 multiSelector 时，range 有效',
        type: Array
    },
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
    changeFunc(e){
      this.triggerEvent('change', arguments);
    },
    cancleFunc(e){
      this.triggerEvent('cancle', arguments);
    }
  }
})
