/**
 * HTT PAPI变量定义
 * @type {string}
 * @private
 */
let _BASE_URL_AUTH = "/oauth";
let _BASE_URL_SYS = "/api/sys";



const apiConfig = {
  'login': "api/1.0/zysoft/user/login",
  "product_list_up":"api/product/up",
  "product_list_down":"api/product/down",
  "product_list":"api/product/list",
  "product_list_clean_img":"api/product/cleanImag",
  "product_statistics":"api/product/statistics",
  "product_bath_list":"api/product/bath/list",
  "product_bath_detail":"api/product/bath/bathDetail",
  "product_bath_bathInfoItem":"api/product/bath/bathInfoItem",
  "product_bath_bathInfoItem_excute":"api/product/bath/excute",
  "product_list_sku":"api/product/sku/list",
  "product_list_sku_up":"api/product/sku/up",
  "product_list_sku_down":"api/product/sku/down",
  "product_list_sku_edit_warn":"api/product/sku/editWarn",
  'loginOut':"/api/1.0/zysoft/user/logout",
  'system_dic_list':"/api/1.0/zysoft/dic/queryByParentKey",
  'system_operlog':"/api/1.0/zysoft/operationLog/pageList",
  'system_dic_tree':"/api/1.0/zysoft/dic/tree",
  'system_dic_add':"/api/1.0/zysoft/dic/add",
  'system_dic_udpate':"/api/1.0/zysoft/dic/udpate",
  'system_dic_del':"/api/1.0/zysoft/dic/del",
  'system_param_list':"/api/1.0/zysoft/sysParam/pageList",
  'system_param_add':"/api/1.0/zysoft/sysParam/add",
  'system_param_udpate':"/api/1.0/zysoft/sysParam/udpate",
  'system_param_del':"/api/1.0/zysoft/sysParam/del",
  'system_param_disable':"/api/1.0/zysoft/sysParam/disAble",
  'system_param_able':"/api/1.0/zysoft/sysParam/able",
  //用户组
  'upms_group_list':"/api/1.0/upms/group/pageList",
  'upms_group_add':"/api/1.0/upms/group/add",
  'upms_group_udpate':"/api/1.0/upms/group/udpate",
  'upms_group_del':"/api/1.0/upms/group/del",
  'upms_group_disable':"/api/1.0/upms/group/disAble",
  'upms_group_able':"/api/1.0/upms/group/able",
  'upms_group_getGroupConfigAuth':"/api/1.0/upms/group/getGroupConfigAuth",
  'upms_group_updateGroupConfigAuth':"/api/1.0/upms/group/updateGroupConfigAuth",
  //角色管理
  'upms_role_list':"/api/1.0/upms/role/pageList",
  'upms_role_add':"/api/1.0/upms/role/add",
  'upms_role_udpate':"/api/1.0/upms/role/udpate",
  'upms_role_del':"/api/1.0/upms/role/del",
  'upms_role_disable':"/api/1.0/upms/role/disAble",
  'upms_role_able':"/api/1.0/upms/role/able",
  'upms_role_updateroleconfigauth':"/api/1.0/upms/role/updateRoleConfigAuth",
  'upms_role_getroleconfigauth':"/api/1.0/upms/role/getRoleConfigAuth",
  //部门
  'upms_depart_add':"/api/1.0/upms/depart/add",
  'upms_depart_udpate':"/api/1.0/upms/depart/udpate",
  'upms_depart_del':"/api/1.0/upms/depart/del",
  'upms_depart_disable':"/api/1.0/upms/depart/disAble",
  'upms_depart_able':"/api/1.0/upms/depart/able",
  'upms_depart_tree':"/api/1.0/upms/depart/tree",
  //权限
  'upms_auth_add':"/api/1.0/upms/auth/add",
  'upms_auth_udpate':"/api/1.0/upms/auth/udpate",
  'upms_auth_del':"/api/1.0/upms/auth/del",
  'upms_auth_disable':"/api/1.0/upms/auth/disAble",
  'upms_auth_able':"/api/1.0/upms/auth/able",
  'upms_auth_tree':"/api/1.0/upms/auth/tree",
  'upms_auth_getfunctionConfig':"/api/1.0/upms/auth/getfunctionConfig",
  'upms_auth_udpateFunctionConfig':"/api/1.0/upms/auth/udpateFunctionConfig",

  //资源
  'upms_function_add':"/api/1.0/upms/function/add",
  'upms_function_udpate':"/api/1.0/upms/function/udpate",
  'upms_function_del':"/api/1.0/upms/function/del",
  'upms_function_disable':"/api/1.0/upms/function/disAble",
  'upms_function_able':"/api/1.0/upms/function/able",
  'upms_function_tree':"/api/1.0/upms/function/tree",
  //用户
  'upms_user_list':"/api/1.0/upms/user/pageList",
  'upms_user_add':"/api/1.0/upms/user/add",
  'upms_user_udpate':"/api/1.0/upms/user/udpate",
  'upms_user_del':"/api/1.0/upms/user/del",
  'upms_user_disable':"/api/1.0/upms/user/disAble",
  'upms_user_able':"/api/1.0/upms/user/able",
  'upms_user_detail':"/api/1.0/upms/user/detail",
  'upms_user_password':"/api/1.0/upms/user/updatePassword",
  'upms_user_depart':"/api/1.0/upms/user/updateDepart",
  'upms_user_group':"/api/1.0/upms/user/updateGroup",
  'upms_user_role':"/api/1.0/upms/user/updateRole",
  //APP提示语
  'frameworkErrorMessage_list':"/api/1.0/common/frameworkErrorMessage/pageList",
  'frameworkErrorMessage_add':"/api/1.0/common/frameworkErrorMessage/add",
  'frameworkErrorMessage_update':"/api/1.0/common/frameworkErrorMessage/update",
  //协议内容
  "yqkjShopCmsList":"/api/1.0/base/cms/pageList",
  "yqkjShopCmsDetail":"/api/1.0/base/cms/detail",
  "yqkjShopCmsAdd":"/api/1.0/base/cms/add",
  "yqkjShopCmsUpdate":"/api/1.0/base/cms/edit",
  "yqkjShopCmsDel":"/api/1.0/base/cms/del",
  //商品分类
  "yqkjShopProductTypeList":"/api/1.0/product/producttype/list",
  "yqkjShopProductTypeLanList":"/api/1.0/product/producttype/lan/list",
  "yqkjShopProductTypeLanDel":"/api/1.0/product/producttype/lan/del",
  "yqkjShopProductTypeDetail":"/api/1.0/product/producttype/detail",
  "yqkjShopProductTypeAdd":"/api/1.0/product/producttype/add",
  "yqkjShopProductTypeEdit":"/api/1.0/product/producttype/edit",
  "yqkjShopProductTypeDisable":"/api/1.0/product/producttype/disable",
  "yqkjShopProductTypeAble":"/api/1.0/product/producttype/able",
  //SKU管理
  "yqkjShopProductSkuList":"/api/1.0/shop/sku/list",
  "yqkjShopProductSkuLanList":"/api/1.0/shop/sku/lan/list",
  "yqkjShopProductSkuLanDel":"/api/1.0/shop/sku/lan/del",
  "yqkjShopProductSkuDetail":"/api/1.0/shop/sku/detail",
  "yqkjShopProductSkuAdd":"/api/1.0/shop/sku/add",
  "yqkjShopProductSkuEdit":"/api/1.0/shop/sku/edit",
  "yqkjShopProductSkuDisable":"/api/1.0/shop/sku/disable",
  "yqkjShopProductSkuAble":"/api/1.0/shop/sku/able",
  "yqkjShopProductSkuQuerySku":"/api/1.0/shop/sku/querySku",

  //商品管理
  "yqkjShopProductList":"/api/1.0/shop/product/list",
  "yqkjShopProductLanList":"/api/1.0/shop/product/lan/list",
  "yqkjShopProductLanDel":"/api/1.0/shop/product/lan/del",
  "yqkjShopProductDetail":"/api/1.0/shop/product/detail",
  "yqkjShopProductAdd":"/api/1.0/shop/product/add",
  "yqkjShopProductEdit":"/api/1.0/shop/product/edit",
  "yqkjShopProductDisable":"/api/1.0/shop/product/down",
  "yqkjShopProductAble":"/api/1.0/shop/product/up",
  "yqkjShopProductDel":"/api/1.0/shop/product/del",
  "yqkjShopProductSelectList":"/api/1.0/shop/product/selectList",

  //运费配置
  "yqkjShopTransList":"/api/1.0/shop/trans/pageList",
  "yqkjShopTransSelectList":"/api/1.0/shop/trans/selectList",
  "yqkjShopTransLanList":"/api/1.0/shop/trans/lan/pageList",
  "yqkjShopTransLanDel":"/api/1.0/shop/trans/lan/del",
  "yqkjShopTransDetail":"/api/1.0/shop/trans/detail",
  "yqkjShopTransAdd":"/api/1.0/shop/trans/add",
  "yqkjShopTransEdit":"/api/1.0/shop/trans/edit",
  "yqkjShopTransDisable":"/api/1.0/shop/trans/disable",
  "yqkjShopTransAble":"/api/1.0/shop/trans/able",
  "yqkjShopDelAble":"/api/1.0/shop/trans/del",
  //区域
  "yqkjShopAreaQuery":"/api/1.0/shop/base/area/query",


  'getCode':"/api/1.0/zysoft/captcha/getCaptcha",
  "menu_tree":`/api/1.0/upms/function/menu`,
  "user_list":`${_BASE_URL_SYS}/v1.0/sysUser/list`,
  //文件上传
  "fileUpload":"/api/1.0/file/upload/upload",

    //   字典
    "dictionaryList" : "/api/1.0/dict/page",
    "dictionaryAdd" : "/api/1.0/dict/add",
    "dictionaryUpdate" : "/api/1.0/dict/update",
    "dictionaryDelete" : "/api/1.0/dict/delete",
    
}

export default apiConfig
