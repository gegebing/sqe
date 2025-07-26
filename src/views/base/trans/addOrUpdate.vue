<template>
  <div class="app-container">
    <el-form :model="dataForm"
             :rules="dataRule"
             v-loading="loading"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="150px">
      <!--运费模板-->
      <el-form-item :label="$t('trans.addOrEdit.name')"
                    prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t('trans.addOrEditTip.name')" class="short-input-width" maxlength="50" show-word-limit/>
      </el-form-item>
      <!--模板类型-->
      <el-form-item :label="$t('trans.addOrEdit.hasFreeFee')"
                    prop="hasFreeFee"
                    required="required">
          <el-switch
            v-model="dataForm.hasFreeFee"
            :active-text="$t('trans.addOrEditTip.hasFreeFee')"
            :inactive-text="$t('trans.addOrEditTip.nothasFreeFee')"
            >
          </el-switch>
      </el-form-item>
      <!--收费方式-->
      <el-form-item :label="$t('trans.addOrEdit.chargeType')"  v-if="dataForm.hasFreeFee == false" prop="chargeType">
        <template>
          <el-radio-group v-model="dataForm.chargeType"
                          :disabled="dataForm.hasFreeFee == true">
            <el-radio :label="0">{{$t('trans.list.table.chargeTypeNum')}}</el-radio>
            <el-radio :label="1">{{$t('trans.list.table.chargeTypeWeight')}}</el-radio>
            <el-radio :label="2">{{$t('trans.list.table.chargeTypeVolume')}}</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <!--默认模板-->
      <el-form-item :label="$t('trans.addOrEdit.hasDefault')"
                    prop="hasDefault">
        <el-switch
          v-model="dataForm.hasUp"
          :active-text="$t('common.table.yes')"
          :inactive-text="$t('common.table.not')">
        </el-switch>
      </el-form-item>
      <!--收费项目-->
      <el-table :data="dataForm.transfees"
                v-if="dataForm.hasFreeFee == false"
                border
                style="width: 100%;"
                class="table-con">
        <el-table-column header-align="center"
                         align="center"
                         width="450"
                         :label="$t('trans.addOrEditTip.freeArea')">
          <template slot-scope="scope">
            <span v-if="scope.$index == 0">{{$t('trans.addOrEditTip.allArea')}}</span>
            <span v-if="(!scope.row.cityList || !scope.row.cityList.length) && scope.$index > 0">{{$t('trans.addOrEditTip.selectCityList')}}</span>
            <span v-if="scope.$index > 0">
              <el-tag v-for="city in scope.row.cityList"
                      :key="city.areaId">{{city.areaName}}</el-tag>
            </span>
            <el-button v-if="scope.$index > 0"
                       type="text"
                       size="small"
                       @click="addOrUpdateHandle(`${scope.$index}`)">{{$t('common.table.updateBtn')}}</el-button>
            <el-button v-if="scope.$index > 0"
                       type="text"
                       size="small"
                       @click="deleteHandle(`${scope.$index}`)">{{$t('common.table.delBtn')}}</el-button>
          </template>
        </el-table-column>
        <!--首个/重/体积-->
        <el-table-column header-align="center"
                         align="center"
                         width="150"
                         :label="tableTitle[0]">
          <template slot-scope="scope">
            <el-form-item :prop="`transfees.${scope.$index}.firstPiece`"
                          label-width="0px"
                          :rules="[{ required: true, message: `${tableTitle[0]}`+ $t('trans.addOrEditTip.notNull') }]">
              <el-input type="number"
                        v-model="scope.row.firstPiece"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column header-align="center"
                         align="center"
                         :label="tableTitle[1]">
          <template slot-scope="scope">
            <el-form-item :prop="`transfees.${scope.$index}.firstFee`"
                          label-width="0px"
                          :rules="[{ required: true, message: `${tableTitle[1]}`+ $t('trans.addOrEditTip.notNull')}]">
              <el-input type="number"
                        v-model="scope.row.firstFee"
                        :min="0"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column header-align="center"
                         align="center"
                         :label="tableTitle[2]">
          <template slot-scope="scope">
            <el-form-item :prop="`transfees.${scope.$index}.continuousPiece`"
                          label-width="0px"
                          :rules="[{ required: true, message: `${tableTitle[2]}` + $t('trans.addOrEditTip.notNull')}]">
              <el-input type="number" min="1"
                        v-model="scope.row.continuousPiece"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column header-align="center"
                         align="center"
                         :label="tableTitle[3]">
          <template slot-scope="scope">
            <el-form-item :prop="`transfees.${scope.$index}.continuousFee`"
                          label-width="0px"
                          :rules="[{ required: true, message: `${tableTitle[3]}` + $t('trans.addOrEditTip.notNull')}]">
              <el-input type="number"
                        :min="0"
                        v-model="scope.row.continuousFee"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px"
           v-if="dataForm.hasFreeFee == false">
        <el-button type="primary"
                   icon="el-icon-location-outline"
                   @click="addTransfee()">{{$t('trans.addOrEditTip.addTransfee')}}</el-button>
      </div>
      <el-checkbox v-model="dataForm.hasFreeCondition" value="0"
                   v-if="dataForm.hasFreeFee == false"
                   style="margin-top:10px;font-size:50px">{{$t('trans.addOrEditTip.hasFreeCondition')}}</el-checkbox>
      <el-table v-if="dataForm.hasFreeCondition && dataForm.hasFreeFee == false"
                :data="dataForm.transfeeFrees"
                border
                style="width: 100%;">
        <el-table-column header-align="center"
                         align="center"
                         width="350"
                         :label="$t('trans.addOrEditTip.freeCityLabel')">
          <template slot-scope="scope">
            <span v-if="!scope.row.freeCityList || !scope.row.freeCityList.length">{{$t('trans.addOrEditTip.selectCityList')}}</span>
            <el-tag v-for="city in scope.row.freeCityList"
                    :key="city.areaId">{{city.areaName}}</el-tag>
            <el-button type="text"
                       size="small"
                       @click="addOrUpdateTransfeeFree(`${scope.$index}`)">{{$t('common.table.updateBtn')}}</el-button>
            <el-button type="text"
                       size="small"
                       @click="deleteTransfeeFree(`${scope.$index}`)">{{$t('common.table.delBtn')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column header-align="center"
                         align="center"
                         width="600"
                         :label="$t('trans.addOrEditTip.freeFeeCondition')">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.freeType">
              <el-radio :label="0">{{$t('trans.addOrEditTip.freeTypeOne')}}</el-radio>
              <el-radio :label="1">{{$t('trans.addOrEditTip.freeTypeTwo')}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column header-align="center"
                         align="left">
          <template slot-scope="scope">
            <el-form-item :prop="`transfeeFrees.${scope.$index}.amount`"
                          v-if="scope.row.freeType == 1 || scope.row.freeType == 2"
                          label-width="0px"
                          :rules="[{ required: true, message:  $t('trans.addOrEditTip.notNull')}]">
              {{$t('trans.addOrEditTip.full')}}<el-input style="width:100px"
                          v-model="scope.row.amount"></el-input> {{$t('trans.addOrEditTip.freeTypeTwoInput')}}
            </el-form-item>
            <el-form-item :prop="`transfeeFrees.${scope.$index}.piece`"
                          v-if="scope.row.freeType == 0 || scope.row.freeType == 2"
                          label-width="0px"
                          :rules="[{ required: true, message:  $t('trans.addOrEditTip.notNull')}]">
              {{$t('trans.addOrEditTip.full')}}<el-input style="width:100px"
                          v-model="scope.row.piece" ></el-input> {{$t('trans.addOrEditTip.freeTypeOneInput')}}
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px"
           v-if="dataForm.hasFreeFee == false">
            <el-button type="primary"
                   icon="el-icon-location-outline" @click="addTransfeeFree">{{$t('trans.addOrEditTip.freeConditionBtn')}}</el-button>
      </div>
      <el-row>
        <el-col :span="10" :offset="6">
            <span  class="dialog-footer" center="true">
                <el-button @click="visible = false"
                           size="medium " round>{{$t('common.form.btn.clean')}}</el-button>
                <el-button type="primary"
                           @click="dataFormSubmit()"
                           size="medium " round>{{$t('common.form.btn.confirm')}}</el-button>
              </span>
        </el-col>
      </el-row>
    </el-form>

    <!--城市选择-->
    <city-add-or-update  v-if="addOrUpdateVisible"
                         ref="addOrUpdate" @refreshDataList="getDataList"></city-add-or-update>
  </div>
</template>
<script>
  import cityAddOrUpdate from './cityAddOrUpdate'

  export default {
    components: { CityAddOrUpdate: cityAddOrUpdate},

    data () {
      return {
        options:{
        },
        dataForm:{
          id:null,
          name:null,
          hasDefault: false,
          hasFreeFee:false,
          chargeType:0,
          transfees:[],
          hasFreeCondition:false,
          transfeeFrees:[]
        },
        dataRule: {
          name: [
            { required: true, message: this.$t('trans.addOrEditTip.nameEmpty')},
          ]
        },
        loading: false,
        visible: false,
        editVisible:false,
        addOrUpdateVisible:false
      }
    },
    created() {
      this.init();
    },
    computed: {
      tableTitle () {
        var titles = [
          [this.$t('trans.addOrEditTip.firstNum'), this.$t('trans.addOrEditTip.transPrice'), this.$t('trans.addOrEditTip.continuousNum'), this.$t('trans.addOrEditTip.continuousPrice')],
          [this.$t('trans.addOrEditTip.firstWeight'), this.$t('trans.addOrEditTip.transPrice'), this.$t('trans.addOrEditTip.continuousWeight'), this.$t('trans.addOrEditTip.continuousPrice')],
          [this.$t('trans.addOrEditTip.firstVolume'), this.$t('trans.addOrEditTip.transPrice'), this.$t('trans.addOrEditTip.continuousVolume'), this.$t('trans.addOrEditTip.continuousPrice')]
        ];
        if (this.dataForm.chargeType) {
          return titles[this.dataForm.chargeType]
        }
        return titles[0]
      }
    },
    methods: {
      goBack(){
        this.$router.push({
          path: '/base/trans',
          query: {}
        })
      },
      // 删除指定包邮条件
      deleteTransfeeFree (rowIndex) {
        this.dataForm.transfeeFrees.splice(rowIndex, 1)
      },
      // 指定包邮条件编辑
      addOrUpdateTransfeeFree (rowIndex) {
        this.addOrUpdateVisible = true
        let allSelectCityList = []
        for (let i = 1; i < this.dataForm.transfeeFrees.length; i++) {
          const freeCityList = this.dataForm.transfeeFrees[i].freeCityList
          allSelectCityList = allSelectCityList.concat(freeCityList)
        }
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(rowIndex, this.dataForm.transfeeFrees[rowIndex].freeCityList || [], allSelectCityList, 1)
        })
      },
      // 添加指定包邮条件
      addTransfeeFree () {
        if (this.dataForm.hasFreeCondition) {
          this.dataForm.transfeeFrees.push({ freeCityList: [], freeType: 0 })
        }
      },
      // 删除运费项
      deleteHandle (rowIndex) {
        this.dataForm.transfees.splice(rowIndex, 1)
      },
      // 添加运费项
      addTransfee () {
        this.editVisible = true
        this.dataForm.transfees.push({ cityList: [], status: 1 })
      },
      // 可配送区域和运费编辑
      addOrUpdateHandle (rowIndex) {
        this.addOrUpdateVisible = true
        let allSelectCityList = []
        for (let i = 1; i < this.dataForm.transfees.length; i++) {
          const cityList = this.dataForm.transfees[i].cityList
          allSelectCityList = allSelectCityList.concat(cityList)
        }
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(rowIndex, this.dataForm.transfees[rowIndex].cityList || [], allSelectCityList, 0)
        })
      },
      getDataList (row, cityList, type) {
        if (type === 0) {
          this.$set(this.dataForm.transfees[row], 'cityList', cityList)
        }
        if (type === 1) {
          this.$set(this.dataForm.transfeeFrees[row], 'freeCityList', cityList)
        }
      },
      init() {
        this.visible = true;
        this.dataForm.id = this.$route.query.transId;
        if (this.dataForm.id != 0) {
            this.loading = true;
            $http.http({
              type: "post",
              url: "yqkjShopTransDetail",
              data: {key: this.dataForm.id}
            }).then((data) => {
              if (data.code == 200) {
                 this.dataForm = data.body;
                this.loading = false;
              }
            }).catch(() => {
              this.loading = false;
            });
        }
      },
      dataFormSubmit(){
        //数据提交
        this.$refs['dataForm'].validate((valid,message) => {
            if (valid) {
              var url = "yqkjShopTransAdd";
              if (this.dataForm.id) {
                url = "yqkjShopTransEdit"
              }
              $http.http({
                type: "post",
                url: url,
                hasLoad:true,
                data: this.dataForm
              }).then((data) => {
                if (data.code == 200) {
                  this.$message({
                    message: this.$t('common.http.successTip'),
                    type: 'success',
                    onClose: () => {
                      this.goBack();
                    }
                  });
                } else {
                  this.$message.error(data.msg);
                }
              }).catch(() => {});
            }
        });
        }
    }
  }
</script>
<style>
  .short-input-width {
    width: 400px;
  }
</style>
