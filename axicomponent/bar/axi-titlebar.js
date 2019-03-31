// axicomponent/bar/axi-titlebar.js
const ComponentWrapper = require('../include.js')('axi-titlebar').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'title': {
      // memo: '标题内容',
      type: String
    },
    'color': {
      // memo: '标题颜色',
      type: String,
      value: '#000000'
    },
    'size': {
      // memo: '字体大小',
      type: Number,
      value: 20
    },
    'hideLeftSide': {
      // memo: '隐藏左边区域',
      type: Boolean,
      value: false
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
    ontap: function(){
      wx.navigateBack();
    }
  },
  created: function(){
    // console.log(111, this.data.hideLeftSide)
  }
})
