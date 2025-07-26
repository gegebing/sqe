<template>
  <div class="mod-prod-sku-tag">
    <el-form-item :label="$t('product.addOrEdit.productSKU')">
      <el-button size="mini" @click="shopTagInput()" v-show="isShowSkuBtn">{{$t('product.addOrEdit.addSku')}}</el-button>
      <div v-for="(tag, tagIndex) in skuTags" :key="tagIndex">
        <span>{{tag.tagName}}</span>
        <el-button class="button-new-tag" type="text"  icon="el-icon-delete" @click="removeTag(tagIndex)">{{$t('common.table.delBtn')}}</el-button>
        <br/>
        <el-tag
          v-for="(tagItem, tagItemIndex) in tag.tagItems"
          :key="tagItem.valueId"
          closable
          :disable-transitions="false"
          @close="handleTagClose(tagIndex, tagItemIndex)">
          {{tagItem.propValue}}
        </el-tag>
      </div>
    </el-form-item>

    <el-form-item :label="$t('product.addOrEditTip.speceName')" v-show="isShowTagInput">
      <el-col :span="8">
        <el-select v-model="addTagInput.skuValue" filterable allow-create default-first-option :placeholder="$t('common.form.defaultTip.select')" @change="handleTagClick">
          <el-option
            v-for="item in unUseTags"
            :key="item.optionId"
            :label="item.opetionName"
            :value="item.optionId">
          </el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item :label="$t('product.addOrEditTip.skuName')" v-show="isShowTagInput"  v-loading="loading">
      <el-col :span="8">
        <el-select v-model="addTagInput.selectValues" multiple filterable allow-create default-first-option :placeholder="$t('common.form.defaultTip.select')">
          <el-option
            v-for="item in dbTagValues"
            :key="item.optionId"
            :label="item.opetionName"
            :value="item.optionId">
          </el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button size="mini" type="primary" @click="addTag()" v-show="isShowTagInput">{{$t('common.form.btn.confirm')}}</el-button>
      <el-button size="mini" @click="hideTagInput()" v-show="isShowTagInput">{{$t('common.form.btn.clean')}}</el-button>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: [],
      isShowTagInput: false,//展示规格数据
      isShowSkuBtn: true,
      addTagItem:[],//新增差异ID
      addTagInput: {
        skuName: '',
        skuValue:"",
        selectValues: []
      },
      loading:true,
      type: 0,
      tagItemName: '',
      tagName: '',
      tagNameIndex: 0,
      tagItemInputs: [],
      dbTags: [],
      dbTagValues: [],//二级规则
      specs: [], // 使用的规格
      maxPropId: 0, // 规格id 最大
      initing: false
    }
  },
  props: {
    skuList: {
      default: []
    }
  },
  created(){
    $http.http({
      type: "post",
      url: "yqkjShopProductSkuQuerySku",
      data: {key:null}
    }).then((data) => {
      this.dbTags = data.body;
    }).catch(() => {});
  },
  computed: {
    // 未使用的规格, 通过计算属性计算
    unUseTags () {
      let res = []
      for (let i = 0; i < this.dbTags.length; i++) {
        const dbTag = this.dbTags[i]
        let specIndex = this.skuTags.findIndex(tag => tag.tagId === dbTag.optionId)
        if (specIndex === -1) {
          res.push(dbTag)
        }
      }
      return this.dbTags
    },
    skuTags: {
      get () { return this.$store.state.prod.skuTags },
      set (val) { this.$store.commit('prod/updateSkuTags', val) }
    },
    defalutSku () {
      return this.$store.state.prod.defalutSku
    }
  },
  watch: {
    skuTags: {
      handler (val, oldVal) {
        if (this.initing) {
          this.initing = false
          return
        }
        let skuList = []
        if (this.type === 4) {
        // 删除规格值
          this.skuList.forEach(sku => {
            let propertiesArray = sku.properties.split(';')
            if (this.tagItemName !== propertiesArray[this.tagNameIndex].split(':')[1]) {
              skuList.push(sku)
            }
          })
        } if (this.type === 2) {
            let tempSkuList = []
          val.forEach(tag => {
            if (skuList.length === 0) {
              tag.tagItems.forEach(tagItem => {
                //过滤以前的值
                let sku = Object.assign({}, this.defalutSku)
                console.log(tag)
                sku.properties = `${tag.tagName}:${tagItem.propValue}` // 销售属性组合字符串
                sku.productSkuInner=tagItem.valueId;
                skuList.push(sku)
              })
            } else {
              tempSkuList = []
              tag.tagItems.forEach(tagItem => {
                skuList.forEach(sku => {
                  let newSku = Object.assign({}, sku)
                  newSku.properties = `${sku.properties};${tag.tagName}:${tagItem.propValue}`
                  newSku.productSkuInner=newSku.productSkuInner + "_" + tagItem.valueId ;
                  tempSkuList.push(newSku)
                })
              })
              skuList = tempSkuList
            }
          })
        }
        else {
        // 增加或删除规格
          let tempSkuList = []
          val.forEach(tag => {
            if (skuList.length === 0) {
              tag.tagItems.forEach(tagItem => {
                let sku = Object.assign({}, this.defalutSku)
                sku.properties = `${tag.tagName}:${tagItem.propValue}` // 销售属性组合字符串
                sku.productSkuInner=tagItem.valueId;
                skuList.push(sku)
              })
            } else {
              tempSkuList = []
              tag.tagItems.forEach(tagItem => {
                skuList.forEach(sku => {
                  let newSku = Object.assign({}, sku)
                  newSku.properties = `${sku.properties};${tag.tagName}:${tagItem.propValue}`
                  newSku.productSkuInner= newSku.productSkuInner + "_" + tagItem.valueId ;
                  tempSkuList.push(newSku)
                })
              })
              skuList = tempSkuList
            }
          })
        }
        if (!skuList.length) {
          skuList.push(Object.assign({}, this.defalutSku))
        }
        this.$emit('change', skuList)
      },
      deep: true
    }
  },
  methods: {
    init (skuList) {
      this.value = skuList
      if (!skuList || !skuList.length) {
        this.skuTags = []
        this.$emit('change', [Object.assign({}, this.defalutSku)])
        return
      }
      this.initing = true
      let skuTags = []
      for (let i = 0; i < skuList.length; i++) {
        const sku = skuList[i]
        if (!sku.properties) break
        let propertiesArray = sku.properties.split(';')
        for (let j in propertiesArray) {
          let properties = propertiesArray[j].split(':')
          if (!skuTags[j]) {
            skuTags[j] = {
              tagName: properties[0],
              tagItems: []
            }
            this.tagItemInputs.push({ visible: false, value: '' })
          }
          let tagItemNameIndex = skuTags[j].tagItems.findIndex((tagItemName) => tagItemName.propValue === properties[1])
          if (tagItemNameIndex === -1) {
            skuTags[j].tagItems.push({propValue: properties[1]})
          }
        }
      }
      this.skuTags = skuTags
    },
    // 显示规格名、规格值输入框
    shopTagInput () {
      this.isShowTagInput = !this.isShowTagInput
    },
    // 隐藏规格名、规格值输入框
    hideTagInput () {
      this.isShowTagInput = false
      this.cleanTagInput()
    },
    addTag () {
      let selectValues = this.addTagInput.selectValues
      if (!this.addTagInput.skuValue) {
        this.$message.error(this.$t('product.addOrEditTip.speceName'))
        return
      }
      if (!selectValues.length) {
        this.$message.error(this.$t('product.addOrEditTip.skuName'))
        return
      }
      this.isShowTagInput = false
      let tagItems = []
      for (let i = 0; i < selectValues.length; i++) {
        const element = selectValues[i]
        let is = Object.prototype.toString.call(element) === '[object Object]'
        if (is) {
          tagItems.push(element)
        } else {
          tagItems.push({propId: element, propValue: this.convertSkuInfo(element), valueId: element});
        }
      }
      // 向规格中放入规格输入框内的数据
      //根据数据判断是新增卡还是更新
      const skuTags = this.$store.state.prod.skuTags;
      let  hasAdd = true;
      let tagIndex =0;
      for (let i =0; i < skuTags.length; i ++ ) {
        if (skuTags[i].tagId == this.addTagInput.skuValue) {
           hasAdd = false;
          tagIndex = i;
           break;
        }
      }
      if (hasAdd) {
        this.type = 1;
        this.$store.commit('prod/addSkuTag', {
          tagName: this.convertSku(this.addTagInput.skuValue),
          tagId: this.addTagInput.skuValue,
          tagItems
        })
      } else {
        this.type = 2;
        for (let i =0,  count = tagItems.length; i < count; i ++ ) {
          const  tagItem = tagItems[i];
          this.$store.commit('prod/addSkuTagItem', {tagIndex,tagItem});
          this.addTagItem.push(tagItem.valueId)
         }
      }
      this.cleanTagInput();
      this.isShowSkuBtn =skuTags.length < 2
    },
    convertSku(code) {//规格转换
      const dbTagValues = this.dbTags;
      for (let i = 0; i < dbTagValues.length; i++) {
        if (code == dbTagValues[i].optionId) {
          return dbTagValues[i].opetionName;
        }
      }
    },
    convertSkuInfo(code) {
      const dbTagValues = this.dbTagValues;
      for (let i = 0; i < dbTagValues.length; i++) {
          if (code == dbTagValues[i].optionId) {
              return dbTagValues[i].opetionName;
          }
      }
    },
    // 清除规格值输入框内容
    cleanTagInput () {
      this.addTagInput = {
        propName: '',
        selectValues: []
      }
      this.dbTagValues = []
    },
      // 规格名输入框，选中规格事件
    handleTagClick () {
      this.addTagInput.selectValues = []
      $http.http({
        type: "post",
        url: "yqkjShopProductSkuQuerySku",
        data: {key:this.addTagInput.skuValue}
      }).then((data) => {
        let dbkus = data.body;
        let skus = [];
        dbkus.forEach(d=>{
          let hasAdd = true;
          this.skuTags.forEach(sku=>{
           sku.tagItems.forEach(tag=>{
             if (d.optionId == tag.valueId) {
               hasAdd = false;
             }
            })
          })
          if (hasAdd) {
            skus.push(d)
          }
        })
        this.dbTagValues = skus;
      }).catch(() => {});
    },
    // 关闭标签 --删除
    handleTagClose (tagIndex, tagItemIndex) {
      this.tagName = this.skuTags[tagIndex].tagName
      this.tagNameIndex = tagIndex
      this.tagItemName = this.skuTags[tagIndex].tagItems[tagItemIndex].propValue
      if (this.skuTags[tagIndex].tagItems.length === 1) {
        return
      }
      this.type = 4
      this.$store.commit('prod/removeSkuTagItem', { tagIndex, tagItemIndex })
    },
    // 删除 规格
    removeTag (tagIndex) {
      this.type = 3
      this.$store.commit('prod/removeSkuTag', tagIndex);
      this.isShowSkuBtn =this.skuTags.length < 2

    }
  }
}
</script>

<style lang="scss">
.mod-prod-sku-tag {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}

// 新增规格外部边框
.sku-border{
  border: 1px solid #EBEEF5;
  width:70%
}
.sku-background{
  background-color: #F6f6f6;
  margin: 12px 12px;
  .el-button{
    margin-left: 10px;
    span{
      color:#000 !important;
    }
  }
  .el-form-item__label{
    padding:0 24px 0 0
  }
}
.sku-tag{
  margin: 12px 12px;
}
.tagTree{
  margin-left: 18px;
  padding-bottom:8px;
}
</style>
