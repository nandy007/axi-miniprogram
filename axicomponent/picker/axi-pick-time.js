// axicomponent/picker/axi-pick-date.js
const ComponentWrapper = require('../include.js')('axi-pick-time').Component;

ComponentWrapper({
  formType: 'select',
  /**
   * 组件的属性列表
   */
  properties: {
    'value': {
      type: String,
      observer(val){
        this.calculateShow();
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
    },
    'placeholder': {
      type: String,
      observer: function (val) {
        this.calculateShow();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showText: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    calculateShow: function () {
      this.setData({
        showText: this.data.value || this.data.placeholder
      });
    },
    bindchangeFunc(e) {
      this.setData({
        value: e.detail.value
      });
      this.triggerEvent('change', e.detail);
    },
    bindcancelFunc(e) {
      this.triggerEvent('cancel', e.detail);
    }
  }
})
