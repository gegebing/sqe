<template>
  <div class="shop-city-add-or-update">
    <el-dialog
      :modal="false"
      :title="$t('trans.addOrEditTip.cityTitle')"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" style="height:400px">
        <el-scrollbar style="height:100%">
          <el-form-item size="mini" :label="$t('trans.addOrEditTip.transArea')">
            <el-tree
              :data="menuList"
              :props="menuListTreeProps"
              node-key="areaId"
              ref="menuListTree"
              show-checkbox
              v-loading="loading"
              v-if="visible">
            </el-tree>
          </el-form-item>
        </el-scrollbar>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    components: {},
    data () {
      return {
        type: 0,
        loading:false,
        visible: false,
        menuList: [],
        rowIndex: 0,
        menuListTreeProps: {
          label: 'areaName',
          children: 'children'
        },
        dataForm: {
          transfeeId: 0
        }
      }
    },
    created(){
      this.loading = true;
      $http.http({
        type: "post",
        url: "yqkjShopAreaQuery",
        data: {}
      }).then((data) => {
        this.menuList=data.body;
        this.loading = false;
      }).catch(() => {});
    },
    methods: {
      init (rowIndex, cityList, allSelectCityList, type) {
        this.type = type
        this.rowIndex = rowIndex
        if (this.menuList.length === 0) {
          this.visible = true
        } else {
          this.visible = true
          this.disabledNodes(cityList, allSelectCityList)
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedNodes(cityList)
          })
        }
      },
      disabledNodes (cityList, allSelectCityList) {
        for (let i = 0; i < this.menuList.length; i++) {
          const childrens = this.menuList[i].children
          this.menuList[i].disabled = false
          let disabledNum = 0
          for (let j = 0; j < childrens.length; j++) {
            const city = childrens[j]
            this.menuList[i].children[j].disabled = false
            let allHasCity = allSelectCityList.findIndex((item) => city.areaId === item.areaId) > -1
            let listHasCity = cityList.findIndex((item) => city.areaId === item.areaId) > -1
            if (allHasCity && !listHasCity) {
              this.menuList[i].children[j].disabled = true
              disabledNum++
            }
          }
          if (disabledNum === this.menuList[i].children.length) {
            this.menuList[i].disabled = true
          }
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$emit('refreshDataList', this.rowIndex, this.$refs.menuListTree.getCheckedNodes(true), this.type)
        this.visible = false
      }
    }
  }
</script>

<style  lang="scss">
.shop-city-add-or-update {
  .el-scrollbar__wrap{overflow-x:hidden;}
}
</style>
