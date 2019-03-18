// axicomponent/label/axi-label.js
const ComponentWrapper = require('../include.js').Component;
ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'for': {
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
    click: function(e){
      var id = this.data['for'];
      if (!id) return;

      var comp = this.selectById(id);

      if (comp) comp.click();
    }
  }
})
