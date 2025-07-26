<template>
  <div class="mod-prod-sku-table">
    <el-form-item>
      <el-table
        :data="value"
        border
        style="width: 100%; margin-top: 20px"
         :span-method="tableSpanMethod">
        <el-table-column v-for="(leftTitle, index) in tableLeftTitles" :key="index" :label="leftTitle" align="center"  width="120">
          <template slot-scope="scope">
              {{scope.row.properties.split(';')[index].split(':')[1]}}
          </template>
        </el-table-column>
        <el-table-column v-if="tableLeftTitles.length"
          prop="pic"
          align="center"
          :label="$t('product.addOrEdit.skuPpic')"
          width="160">
          <template slot-scope="scope">
            <pic-upload v-model="scope.row.pic"  :value.sync="scope.row.pic" fileTypeCode="100004">
            </pic-upload>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          align="center"
          :label="$t('product.addOrEdit.salePrice')"
          width="160">
          <template slot-scope="scope">
             <el-input-number
              size="small"
              v-model="scope.row.salePrice"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.01"
              :disabled="!scope.row.status">
          </el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="otherPrice"
          align="center"
          :label="$t('product.addOrEdit.oriPrice')"
          width="160">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              v-model="scope.row.otherPrice"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.01"
              :disabled="!scope.row.status">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="stocks"
          align="center"
          :label="$t('product.addOrEdit.stockNum')"
          width="160">
          <template slot-scope="scope">
            <el-input-number size="mini" :min="0" controls-position="right" v-model="scope.row.stockNum" type="number" :disabled="scope.row.status == 0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          align="center"
          :label="$t('product.addOrEdit.weight')"
          width="200">
          <template slot-scope="scope">
            <el-input-number :precision="2" size="mini" :min="0" controls-position="right" v-model="scope.row.weight" :disabled="scope.row.status == 0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="volume"
          align="center"
          :label="$t('product.addOrEdit.volume')"
          width="200">
          <template slot-scope="scope">
            <el-input-number :precision="2" :min="0" size="mini" controls-position="right" v-model="scope.row.volume" :disabled="scope.row.status == 0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          :label="$t('common.table.op')">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="changeSkuStatus(`${scope.$index}`)" v-if="scope.row.status">{{$t('product.list.table.downStatus')}}</el-button>
            <el-button type="text" size="small" @click="changeSkuStatus(`${scope.$index}`)" v-else>{{$t('product.list.table.upStatus')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
  import PicUpload from '@/components/pic-upload'
  export default {
    data () {
      return {
        // 数据库中的规格
        dbSpecs: [],
        // 根据选定的规格所查询出来的规格值
        dbSpecValues: [],
        specs: [], // 使用的规格
        initing: false
      }
    },
    components: {
      PicUpload
    },
    props: {
      value: {
        default: [],
        type: Array
      },
      prodName: {
        default: ''
      }
    },
    watch: {
      prodName: function () {
        this.skuAddProdName()
      }
    },
    created: function () {
    },
    computed: {
      tableLeftTitles () {
        let res = []
        for (let i = 0; i < this.skuTags.length; i++) {
          const skuTag = this.skuTags[i]
          res.push(skuTag.tagName)
        }
        return res
      },
      skuTags: {
        get () {
          return this.$store.state.prod.skuTags
        }
      },
      defalutSku () {
        return this.$store.state.prod.defalutSku
      }
    },
    methods: {
      init () {
        this.initing = true
      },
      getTableSpecData () {
        return this.value
      },
      tableSpanMethod ({ row, column, rowIndex, columnIndex }) {

      },
      changeSkuStatus (tagIndex) {
        this.value[tagIndex].status = this.value[tagIndex].status ? 0 : 1
      },
      skuAddProdName () {
        if (this.initing) {
          return
        }
        let skuList = []
        for (let i = 0; i < this.value.length; i++) {
          const sku = Object.assign({}, this.value[i])
          if (!sku.properties) {
            return
          }
          sku.skuName = ''
          debugger
          let properties = sku.properties.split(';')
          for (const propertiesKey in properties) {
            sku.skuName += properties[propertiesKey].split(':')[1] + ' '
          }
          sku.prodName = this.prodName + ' ' + sku.skuName
          skuList.push(sku)
        }
        this.$emit('input', skuList)
      }
    }
  }
</script>

<style lang="scss">

  .mod-prod-sku-table{
    .pic-uploader-component .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .pic-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
      }
      .pic {
        width: 120px;
        height: 120px;
        display: block;
      }
    }
    .pic-uploader-component .el-upload:hover {
      border-color: #409EFF;
    }
  }
</style>
