// components/RefreshView/axi-refresh.js
const ComponentWrapper = require('../include.js')('axi-radio').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  created: function(){
    
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView");
    // console.log(this.refreshView)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //触摸开始
    handletouchstart: function (event) {
      this.refreshView.handletouchstart(event)
    },
    //触摸移动
    handletouchmove: function (event) {
      this.refreshView.handletouchmove(event)
    },
    //触摸结束
    handletouchend: function (event) {
      this.refreshView.handletouchend(event)
    },
    //触摸取消
    handletouchcancel: function (event) {
      this.refreshView.handletouchcancel(event)
    },
    //页面滚动
    onScroll: function (event) {
      this.refreshView.onPageScroll(event)
    },
    onScrollLower: function(){
      var comp = this;
      if (comp.__upFlag) return;
      comp.__upFlag = true;
      this.triggerEvent('pullup', {
        refresh: function () {
          comp.__upFlag = false;
        }
      });
    },
    onPullDownRefresh: function(){
      var comp = this;
      // setTimeout(() => { this.refreshView.stopPullRefresh() }, 1000)
      this.triggerEvent('pulldown', {
        refresh: function(){
          comp.refreshView.stopPullRefresh()
        }
      });
    }
  }
})
