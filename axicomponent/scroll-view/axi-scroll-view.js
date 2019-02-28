// axicomponent/scroll-view/axi-scroll-view.js
const ComponentWrapper = require('../include.js').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'direction': {
      type: String,
      observer: function (newVal) {
        if (newVal === 'horizontal'){
          this.setData({
            scrollX: true,
            scrollY: false
          });
        }else{
          this.setData({
            scrollX: false, 
            scrollY: true
          });
        }
      }
    },
    'upperThreshold': {
      type: Number,
      value: 50
    },
    'lowerThreshold': {
      type: Number,
      value: 50
    },
    'enableBackToTop': {
      type: Boolean,
      value: false,
    },
    'scrollWithAnimation': {
      type: Boolean,
      value: false
    },
    'scrollIntoView': {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollX: false,
    scrollY: true

  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrolltoupperFunc(e){
      this.triggerEvent('scrolltoupper', arguments);
    },
    scrolltolowerFunc(e){
      this.triggerEvent('scrolltolower', arguments);
    },
    scrollFunc(e){
      this.triggerEvent('scroll', arguments);
    }
  }
})
