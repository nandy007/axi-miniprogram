//index.js
//获取应用实例
const app = getApp()
const PageWrapper = require('../../axicomponent/include.js').Page;
PageWrapper({
  data: {
    content: ['111', '恭喜你，学会了小程序组件'],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scroll: true,
    items: [
              {
                    "url": "http://127.0.0.1/1.flv",
                    "title": "这是标题一"
              },
              {
                    "url": "http://127.0.0.1/2.flv",
                    "title": "这是标题二"
              }
        ],
    list: [
      {
        title: '标题二'
      }
    ],
    node: '<span >1111</span>'
  },
  onLoad: function () {
    // console.log(222)
    
  },
  defaultTap: function(e){
    console.log(e.currentTarget)
  },
  scrollTop: function(e){
    console.log(e);
  },
  scroll: function (e) {
    console.log(e);
  },
  actived: function(e){
    console.log(e)
  },
  change : function(e){
    console.log(e)
  },
  cancel: function(e){
    console.log(e)
  }
})
