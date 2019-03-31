// axicomponent/image/axi-image.js
const ComponentWrapper = require('../include.js')('axi-image').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'src': {
      // memo: '图片地址',
      type: String
    },
    'mode': {
      // memo: '图片裁剪、缩放的模式',
      type: String
    },
    'src': {
      // memo: '图片地址',
      type: String
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    width: '',
    height: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    errorFunc: function(e) {
        this.triggerEvent('error', arguments);
    },
    loadFunc: function(e) {
      var mode = this.data.mode;
      if (mode ==='autoFit'){
        var width = e.detail.width, height = e.detail.height;
        this.setData({
          width: width,
          height: height
        });
      }
      this.triggerEvent('load', arguments);
    }
  }
})
