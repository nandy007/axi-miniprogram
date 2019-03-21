// axicomponent/swiper/axi-swiper.js
const ComponentWrapper = require('../include.js')('axi-swiper').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'type': {
      type: String
    },
    'vertical': {
      type: Boolean
    },
    'autoplay': {
      type: Boolean
    },
    'interval': {
      type: Number,
      value: 5000
    },
    'current': {
      type: Number
    },
    'currentItemId': {
      type: String
    },
    'indicatorDots':{
      type: Number
    },
    'indicatorColor': {
      type: String
    },
    'indicatorActiveColor': {
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
    // toDo: function(){

    // }
  }
})
