//index.js
//获取应用实例

const PageWrapper = require('../../axicomponent/include.js').Page;
PageWrapper({
  data: {
    isShow: true,
    content: ['111', '恭喜你，学会了小程序组件'],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scroll: true,
    cks: ['1'],
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
    // this.setData({
    //   isShow: true
    // })
    // this.data.isShow = true;
    setTimeout(()=>{
      this.setData({
        isShow: false
      });
      setTimeout(() => {
        this.setData({
          isShow: true
        })
      }, 3000);
      // console.log(this.selectComponent('#ck'))
    }, 3000);

    
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
    console.log(e.detail)
  },
  cancel: function(e){
    console.log(e)
  }
})
