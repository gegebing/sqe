<template>
  <div class="app-container">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="150px" v-if="showForm">
          <!--商品名称-->
          <el-form-item :label="$t('product.list.table.name')"
                        prop="productName">
            <el-input v-model="dataForm.productName" class="p-w-500" :placeholder="$t('product.list.queryFormTip.name')"  maxlength="50" show-word-limit/>
          </el-form-item>
          <!--商品分类-->
          <el-form-item :label="$t('product.addOrEdit.productTypeName')"
                        prop="productType">
              <TreeSelect v-model="dataForm.productType" class="p-w-500"   :option='options.parentProduct' :prop="prop"  :value.sync = "dataForm.productType"/>
          </el-form-item>
          <!--商品价格-->
          <el-form-item :label="$t('product.addOrEdit.productPrice')"
                        prop="productPrice">
              <el-input-number v-model="dataForm.productPrice" class="p-w-300" :placeholder="$t('product.addOrEditTip.productPrice')"  :precision="2" :step="1000" :max="9999999999999.99"/>
          </el-form-item>
          <!--商品成本价格-->
          <el-form-item :label="$t('product.addOrEdit.productCost')"
                        prop="productCost">
            <el-input-number v-model="dataForm.productCost" class="p-w-300"  :placeholder="$t('product.addOrEditTip.productCost')"  :precision="2" :step="1000" :max="9999999999999.99"/>
          </el-form-item>
          <!--Banner图片-->
          <el-form-item :label="$t('product.addOrEdit.productBanner')"
                        prop="bannerPic">
              <mulPicUpload v-model="dataForm.bannerPic"  fileTypeCode="100003" :allList.sync="dataForm.bannerPic"></mulPicUpload>
          </el-form-item>
          <!--商品SKU管理-->
          <sku-tag ref="skuTags"
                   :skuList="dataForm.skuList" @change="skuTagChangeSkuHandler"></sku-tag>
          <sku-table ref="skuTable"
                     v-model="dataForm.skuList"
                     :prodName.sync="dataForm.name"></sku-table>
          <!--商品详情-->
          <el-form-item :label="$t('product.addOrEdit.productInfo')"
                        prop="showUrl">
            <div class="product-info-div">
              <img  v-for="url in showUrl" :key="url" :src="url" width="345"  v-if="showImg" />
            </div>
            <div class="product-info-upload-div">
              <mulPicUpload v-model="contentinfoList" @mulPicUploadChange="mulPicUploadChange"  fileTypeCode="100003"  :allList.sync="contentinfoList"></mulPicUpload>
            </div>
          </el-form-item>
          <!--配送方式-->
          <el-form-item :label="$t('product.addOrEdit.deliveryMethod')"
                        prop="deliveryMethod">
            <el-select v-model="dataForm.deliveryMethod" :placeholder="$t('product.addOrEditTip.deliveryMethod')">
              <el-option
                v-for="item in options.deliveryMethodOption"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <!--运费模板-->
          <el-form-item :label="$t('product.addOrEdit.transTemplate')"
                        prop="deliveryMethod">
            <el-select v-model="dataForm.transTemplate">
              <el-option
                v-for="item in options.transTemplates"
                :key="item.optionId"
                :label="item.opetionName"
                :value="item.optionId">
              </el-option>
            </el-select>
          </el-form-item>
          <!--是否严选产品-->
          <el-form-item :label="$t('product.addOrEdit.hasCarefullyChosen')"
                        prop="hasCarefullyChosen">
            <el-switch
              v-model="dataForm.hasCarefullyChosen"
              :active-text="$t('common.table.yes')"
              :inactive-text="$t('common.table.not')">
            </el-switch>
          </el-form-item>
          <!--上架商品状态-->
        <el-form-item :label="$t('product.addOrEdit.upStatus')"
                      prop="hasUp">
          <el-switch
            v-model="dataForm.hasUp"
            :active-text="$t('product.list.queryForm.up')"
            :inactive-text="$t('product.list.queryForm.down')">
          </el-switch>
        </el-form-item>
          <!--关联商品--->
        <el-form-item v-if="showProductSelect"  :label="$t('product.addOrEdit.relatedProduct')"
                        prop="relatedProduct">
            <el-tag v-for="(iteam, index) in dataForm.relatedProduct" :key="index">{{iteam.productName}}</el-tag>
            <el-button @click="addProd"  size="small">{{$t('product.addOrEditTip.selectProduct')}}</el-button>
          </el-form-item>
        <product-select ref="productSelect" @refreshSelectProduct="refreshSelectProds"></product-select>
    </el-form>
    <el-row>
      <el-col :span="10" :offset="10">
            <span  class="dialog-footer" center="true">
                <el-button @click="goBack"
                           size="medium " round>{{$t('common.btn.goBack')}}</el-button>
                <el-button type="primary"
                           @click="dataFormSubmit()"
                           size="medium " round>{{$t('product.list.btn.publishProduct')}}</el-button>
              </span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import mulPicUpload from '@/components/mul-pic-upload'
  import TreeSelect from "@/components/TreeSelect"
  import productSelect from "@/components/productselect"
  import { Loading } from 'element-ui';


  import skuTag from "./skuTag"
  import skuTable from "./skuTable"

  export default {
    components: { mulPicUpload, TreeSelect, skuTag, skuTable, productSelect},
    data () {
      return {
        showForm:false,
        prop: {
          disabled:false,
          checkStrictly: true,
        },
        options:{
          deliveryMethodOption: options.deliveryMethodOption,
          parentProduct: [],
          transTemplates:[]

        },
        contentinfoList:[],
        showUrl:[
        ],
        showImg:true,
        showProductSelect:true,
        dataForm:{
          id:null,
          productId:null,
          productType:'',
          productName:null,
          bannerPic:[],
          bannerPics:[],
          productCost: 1000,
          productPrice: 1000,
          skuList: [this.$store.state.prod.defalutSku],
          tagList: [],
          contentInfo: [],
          hasCarefullyChosen: false,
          hasUp: false,
          transTemplate:null,
          contentinfoLists:[],
          relatedProduct:[],
          deliveryMethod:'20',
        },
        dataRule: {
          productName: [
            { required: true, message: this.$t("product.list.queryFormTip.name"), trigger: 'blur' },
          ],
          productType:[
            { required: true, message: this.$t("product.addOrEdit.productTypeName"), trigger: 'blur' },
          ],
          bannerPic:[
            { required: true, message: this.$t("product.addOrEdit.productBanner"), trigger: 'blur' },
          ],
          productCost:[
            { required: true, message: this.$t("product.addOrEditTip.productCost"), trigger: 'blur' },
          ],
          productPrice:[
            { required: true, message: this.$t("product.addOrEdit.productPrice"), trigger: 'blur' },
            { required: true, message: this.$t("product.addOrEdit.productPrice"), trigger: 'blur' },
          ]
        },
        loading: false,
        visible: false,
      }
    },
    mounted() {
    },
    created() {
      //加载商品详情
      this.$store.commit('prod/cleanSkuTags');
      if (this.$route.query.prodId != 0) {
        this.showForm = false;
        let loadingInstance = Loading.service({});
        //加载详情数据
        $http.http({
          type: "post",
          url: "yqkjShopProductDetail",
          data: {key: this.$route.query.prodId}
        }).then((data) => {
          if (data.body) {
            this.dataForm = data.body;
            let  bannerPc = [];
            for (let index = 0, count = data.body.bannerPics.length; index < count; index++) {
              bannerPc.push({
                imgUrl: data.body.bannerPics[index],
                orderNumber: index
              })
            }
            this.dataForm.bannerPic = bannerPc;
            this.showUrl = data.body.contentInfo;
            if (this.showUrl) {
              for (let index = 0, count = this.showUrl.length; index < count; index++) {
                this.contentinfoList.push({
                  imgUrl: this.showUrl[index],
                  orderNumber: index
                })
              }
            }
          }
          this.showForm =true;
          loadingInstance.close();
          this.$nextTick(()=>{
           this.$refs.skuTags.init(this.dataForm.skuList);
          });
        }).catch(() => {
        });
      } else {
        this.showForm = true;
      }
      $http.http({
        type: "post",
        url: "yqkjShopProductTypeList",
        data: {}
      }).then((data) => {
        this.options.parentProduct = data.body;
      }).catch(() => {
      });
      //初始化默认运费模板
      $http.http({
        type: "post",
        url: "yqkjShopTransSelectList",
        data: {}
      }).then((data) => {
        this.options.transTemplates = data.body;
        this.$nextTick(()=> {
          if (data.body) {
            data.body.forEach((template) => {
              if (template.hasDefault === true) {
                this.dataForm.transTemplate = template.optionId;
              }
            })
          }
        });
      }).catch(() => {
      });
    },
    watch:{
    },
    methods: {
      goBack(){
        this.$router.push({
          path: '/product/list',
          query: {}
        })
      },
      mulPicUploadChange(pics) {
        let urls = [];
        this.showImg = false;
        if (pics) {
           let newC = Object.assign([], pics);
            newC.sort(function (a, b) {
              return a.orderNumber - b.orderNumber
            });
          newC.forEach(url => {
            urls.push(url.imgUrl);
          })
        }
        this.showUrl = urls;
        this.showImg = true;
      },
      refreshSelectProds(productCodes) {
        this.showProductSelect = false;
        if (!productCodes) {
          this.dataForm.relatedProduct = [];
        } else {
          this.dataForm.relatedProduct = productCodes;
        }
        this.showProductSelect = true;
      },
      addProd(){
        this.showProductSelect = true;
        this.$nextTick(() => {
          this.$refs.productSelect.init(this.dataForm.relatedProduct)
        })
      },
      skuTagChangeSkuHandler (skuList) {
        const prodName = this.dataForm.prodName
        skuList.forEach(sku => {
          if (sku.properties) {
            sku.skuName = ''
            let properties = sku.properties.split(';')
            for (const propertiesKey in properties) {
              sku.skuName += properties[propertiesKey].split(':')[1] + ' '
            }
            sku.prodName = prodName + ' ' + sku.skuName
          }
        })
        this.dataForm.skuList = skuList
      },
      dataFormSubmit(){
        //数据提交
        let loadingInstance = Loading.service({});
        let banner = [];
        this.dataForm.contentInfo = this.showUrl;
        if (this.dataForm.bannerPic) {
          this.dataForm.bannerPic.forEach((item) => {
             banner.push(item.imgUrl);
          })
          this.dataForm.bannerPics = banner;
        }
        this.$refs['dataForm'].validate((valid,message) => {
            if (valid) {
              var url = "yqkjShopProductAdd";
              if (this.dataForm.productId) {
                url = "yqkjShopProductEdit"
                this.dataForm.id = this.dataForm.productId;
              }
              $http.http({
                type: "post",
                url: url,
                data: this.dataForm
              }).then((data) => {
                if (data.code == 200) {
                  this.$message({
                    message: this.$t('common.http.successTip'),
                    type: 'success',
                    onClose: () => {
                      this.visible = false
                      loadingInstance.close();
                      this.$router.push({
                        path: '/product/list',
                        query: {}
                      })
                    }
                  });

                } else {
                  this.$message.error(data.msg);
                  loadingInstance.close();
                }
              }).catch(() => {
                  loadingInstance.close();
              });
            }
        });
        }
    }
  }
</script>
<style>
  .p-w-500{
    width: 500px;
  }
  .p-w-300{
    width: 300px;
  }
  .app-container {
    padding: 30px;
  }
  #product-info-div>img{
    border: 0px;
    display: table-cell;
    margin-left: 7px;
  }
  #product-info-div>img:first-child {
    padding-top: 15px;
  }
  .product-info-div{
    text-align: center;
    width: 355px;
    height: 700px;
    float: left;
    overflow-y: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 5px;
  }
  .product-info-upload-div {
    margin-left:10px;
    float: left;
    width: 664px;
    height: 700px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 5px;
  }
  .el-upload--picture-card{
    margin-left: 8px;
  }
</style>
