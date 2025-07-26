export default {
  namespaced: true,
  state: {
    id: 0,
    skuTags: [],
    defalutSku: {
      salePrice: 0, // 销售价
      productSkuInner:"",//sku
      otherPrice: 0, // 市场价
      stockNum: 0, // 库存
      properties: '', // 销售属性组合字符串
      skuName: '', // sku名称
      weight: 0, // 商品重量
      volume: 0, // 商品体积
      status: 1 // 0 禁用 1 启用
    }
  },
  mutations: {
    cleanSkuTags(state) {
      state.skuTags = [];
    },
    updateSkuTags (state, skuTags) {
      state.skuTags = skuTags
    },
    addSkuTag (state, skuTag) {
      state.skuTags.push(skuTag)
    },
    removeSkuTag (state, tagIndex) {
      state.skuTags.splice(tagIndex, 1)
    },
    removeSkuTagItem (state, {tagIndex, tagItemIndex}) {
      state.skuTags[tagIndex].tagItems.splice(tagItemIndex, 1)
    },
    addSkuTagItem (state, {tagIndex, tagItem}) {
      state.skuTags[tagIndex].tagItems.push(tagItem)
    }
  }
}
