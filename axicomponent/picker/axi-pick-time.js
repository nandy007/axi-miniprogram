// axicomponent/picker/axi-pick-date.js
const ComponentWrapper = require('../include.js').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'value': {
      type: String,
      observer(val){
        this.setData({
          val: val
        });
      }
    },
    'start': {
      type: String
    },
    'end': {
      type: String
    },
    'disabled': {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    val: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindchangeFunc(e){
      this.setData({
        val: e.detail.value
      });
      this.triggerEvent('change', arguments);
    },
    bindcancelFunc(e){
      this.triggerEvent('cancel', arguments);
    }
  }
})
