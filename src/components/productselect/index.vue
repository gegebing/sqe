<template>
  <el-dialog :title="$t('common.components.productSelect.title')"
             :modal="true"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" size="small">
      <el-form-item :label="$t('product.list.queryForm.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('product.list.queryFormTip.name')" maxlength="30" show-word-limit clearable></el-input>
      </el-form-item>
      <el-button type="primary" @click="getDataList" size="small" icon="el-icon-search">{{$t('common.table.queryBtn')}}</el-button>
    </el-form>
    <el-table ref="prodTable"
              :data="dataList"
              border
              v-loading="dataListLoading"
              @selection-change="selectChangeHandle"
              style="width: 100%;"
              >
      <el-table-column v-if="isSingle" width="50"
                       header-align="center"
                       align="center">
        <template slot-scope="scope">
            <el-radio :label="scope.row.productCode"
                      v-model="singleSelectProdId"
                      @change.native="getSelectProdRow(scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column v-if="!isSingle"
                       type="selection"
                       header-align="center"
                       align="center"
                       width="60">
      </el-table-column>
      <el-table-column prop="productName"
                       header-align="center"
                       width="260"
                       align="center"
                       :label="$t('common.components.productSelect.productName')">
      </el-table-column>
      <el-table-column prop="productCode"
                       header-align="center"
                       width="150"
                       align="center"
                       :label="$t('common.components.productSelect.productName')">
      </el-table-column>
      <el-table-column align="center"
                       width="150"
                       :label="$t('common.components.productSelect.productPic')">
        <template slot-scope="scope">
          <el-image :src="scope.row.pic"
               :preview-src-list="productPic(scope.row.pic)"
               width="100"
               height="100"/>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageNum"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="total"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <span slot="footer">
      <el-button @click="visible = false">{{$t('common.form.btn.clean')}}</el-button>
      <el-button type="primary"
                 @click="submitProds()">{{$t('common.form.btn.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        name:""
      },
      selectProds: [],
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      total:0,
      dataListLoading: false,
      dataListSelections: [],//多选中
      singleSelectProdId: 0,//单选中数据
      addOrUpdateVisible: false
    }
  },
  props: {
    isSingle: {
      default: false,
      type: Boolean
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    productPic(url){
      let pic = [url];
      return pic;
    },
    // 获取数据列表
    init (selectProds) {
      this.selectProds = selectProds
      this.visible = true
      this.dataListLoading = true
      if (this.selectProds) {
        this.selectProds.forEach(row => {
          this.dataListSelections.push(row)
        })
      }
      this.getDataList()
    },
    getDataList () {
      $http.http({
        type: "post",
        url: "yqkjShopProductSelectList",
        data: {
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          name: this.dataForm.name
        }
      }).then((data) => {
        this.dataList = data.body.list
        this.total = data.body.total
        this.pageNum = data.body.pageNum;
        this.pageSize = data.body.pageSize;
        this.dataListLoading = false;
        if (this.selectProds) {
          //根据以前初始值选中默认值
          this.$nextTick(() => {
            this.selectProds.forEach(row => {
              let index = this.dataList.findIndex((productItem) => productItem.productCode === row.productCode)
              this.$refs.prodTable.toggleRowSelection(this.dataList[index])
            })
          })
        }
      }).catch(() => {});
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNum = val
      this.getDataList()
    },
    // 单选商品事件
    getSelectProdRow (row) {
      this.dataListSelections = [row]
    },
    // 多选点击事件
    selectChangeHandle (selection) {
      this.dataList.forEach((tableItem) => {
        let selectedProdIndex = selection.findIndex((selectedProd) => {
          if (!selectedProd) {
            return false
          }
          return selectedProd.productCode === tableItem.productCode
        })
        let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.productCode === tableItem.productCode)
        if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
          this.dataListSelections.push(tableItem)
        } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
          this.dataListSelections.splice(dataSelectedProdIndex, 1)
        }
      })
    },
    // 确定事件
    submitProds () {
      let prods = []
      if (this.dataListSelections.length > 0) {
        this.dataListSelections.forEach(item => {
          let prodIndex = prods.findIndex((prod) => prod.productCode === item.productCode)
          if (prodIndex === -1) {
            prods.push({productCode: item.productCode, productName: item.productName});
          }
        })
      }
      this.$emit('refreshSelectProduct', prods)
      this.dataListSelections = []
      this.visible = false
    }
  }
}
</script>
