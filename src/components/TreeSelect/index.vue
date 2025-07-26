<template>
  <div class="block">
    <el-cascader
      v-model="defaultValue"
      :style="width"
      :options="option"
      :show-all-levels="false"
      :props="prop"
      :disabled="hasDisable"
      collapse-tags
      clearable
      @change="handleChange">
      <template slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
  </div>
</template>
<script>
  export default {
    props:{
      hasDisable: {
        type:[Boolean],
        default(){
          return  false;
        }
      },
      width:{
        type:[String, Number],
        default(){
          return  "width:100%";
        }
      },
      value:{
        type:[String]
      },
      prop:{
        type: [Object, Array],
        default(){
         return  {multiple: false,disabled: false}
        }
      },
      option:{
        type: [Array],
        required: true
      }
    },
    data() {
      return {
        defaultValue: "",
        multiple: this.prop.multiple
      };
    },
    created() {
      if (this.value) {
        var splitArray = this.value.split(',');
        var array = [];
        for(var i = 0; i < splitArray.length; i++){
            var arr = splitArray[i].split("|");
            var tempArray = [];
            var tempStr = "";
            for (var index =0 ; index < arr.length ; index ++) {
              if (index == 0) {
                tempStr = arr[index];
              } else {
                tempStr = tempStr + "|" + arr[index];
              }
              tempArray.push(tempStr);
            }
            if (this.multiple) {
              array.push(tempArray);
            } else {
              array= tempArray;
            }
          }
        this.defaultValue = array;
      }
    },
    methods: {
      handleChange(val) {
        var parValue = " ";
        //检查数据
        if(this.multiple) {
         for (var index = 0; index < val.length; index ++ ) {
           if (parValue.length > 0) {
             parValue += ",";
           }
           var data = val[index];
           parValue += data[data.length -1];
         }
        }else  {
          parValue = val[val.length-1];
        }
        this.$emit("update:value", parValue);
      }
    }
  };
</script>
