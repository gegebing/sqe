/*
*带有权限
*<auth-button type="primary" perms="user:add" label="新增用户" @click="addUser"/>
*import psy_button from "@/components/psy_button"
components: {
'psy-button':psy_button
}
*/
<template>
  <el-button :size="size" :type="type" :icon="icon" :loading="loading" v-if="hasPerms(perms)" @click="handleClick(perms)">
    {{handleLable(perms)}}
  </el-button>
</template>

<script>
  import { hasPermission,getAuthName } from '@/utils/auth.js'
  export default {
    name: 'auth-button',
    props: {
      label: {  // 按钮显示文本
        type: String,
        default: 'Button'
      },
      icon: {  // 按钮显示图标
        type: String,
        default: ''
      },
      size: {  // 按钮尺寸
        type: String,
        default: 'medium'
      },
      type: {  // 按钮类型
        type: String,
        default: null
      },
      loading: {  // 按钮加载标识
        type: Boolean,
        default: false
      },
      disabled: {  //
        type: Boolean,
        default: true
      },
      perms: {  // 按钮权限标识，外部使用者传入
        type: String,
        default: null
      }
    },
    data() {
      return {
      }
    },
    methods: {
      handleLable:function(perms){
       /* const authName = getAuthName(perms);
        if (authName) {
          return authName;
        }*/
        return this.label;
      },
      handleClick: function (perms) {
        let p=this.hasClickPerms(perms)
        if(p==1){//此处可以进行一些提示信息需求的处理
          // 按钮操作处理函数
          this.$emit('click', {})
        }else{
        }
      },
      hasClickPerms: function (perms) {
        // 根据权限标识和外部指示状态进行权限判断
        return hasPermission(perms)
      },
      hasPerms: function (perms) {
        // 根据权限标识和外部指示状态进行权限判断
        if (!this.disabled) {
          return 0;
        }
        let p=hasPermission(perms);
        return p
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>
</style>
