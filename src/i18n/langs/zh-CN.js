//需要转换的中文
export default {
  common:{
    components:{
      dateRange:{
        start:"开始日期",
        end:"结束日期",
        reparator:"至"
      },
      productSelect:{
        title:"选择商品",
        productName:"商品名称",
        productPic:"商品图片",
      },
      mulFile:{
        sortTip:"拖曳图片可排序",
        upload:"点击上传",
        title:"图片预览",
        uploadSize:"图片大小不超过10M"
      }
    },
    btn:{
      goBack:"返回"
    },
    tip:{
      del:"确定删除吗?"
    },
    drawer:{
      lan:"语言包管理"
    },
    file:{
      picFormat:"上传图片只能是jpeg/jpg/png/gif格式",
      maxSize:"上传图片大小不能超过20MB"
    },
    http:{
      successTip: "操作成功",
    },
    form:{
      defaultTip:{
        select: "请选择",
        input:"请输入"
      },
      btn:{
        clean:"取 消",
        confirm: "确 认"
      }
    },
    table:{
      language:"语言",
      queryBtn:"查询",
      addBtn:"新增",
      editBtn:"修改",
      updateBtn:"编辑",
      delBtn:"删除",
      opUser:"操作用户",
      opTime:"操作时间",
      status:"状态",
      disAble:"禁用",
      able:"启用",
      notStatus:"未知状态",
      op:"操作",
      no:"序号",
      yes:"是",
      not:"否",
      lan:"语言包管理"
    },
    menu:{
    },
    site:{
        title:"人员资格资质与授权管理",
        home:"首页",
        personalCenter: "个人中心",
        loginOut: "退出"
      }
  },
  login:{
    language:"语言切换",
    title:"人员资格资质与授权管理",
    acctTip:"请输入账户",
    passwordTip:"请输入密码",
    veriCode:"请输入验证码",
    loginButton:"登录"
  },
  errorMessageTable:{
    option: {
        codeType: {
          admin:"后端",
          app:"前端"
        }
      },
    list:{
      queryForm:{
        language: "语言",
        code:"编码",
        type:"类型",
        tip:"提示语"
      },
      table:{

      }
    }
  },
  baseCms: {
    //协议管理
    option:{
      cmsType:{
        privateAgreement:"隐私协议",
        termService:"服务条款",
        logisticsPolicy:"物流政策",
        aboutMe:"关于我们",
        joinMe:"加盟代理",
        register:"注册协议",
        refundRule:"退货规则"
      }
    },
    list:{
      queryForm: {
        name:"协议名称",
        type:"协议类型",
        content:"协议内容"
      },
      queryFormTip:{
        name:"请输入协议名称",

      }
      ,
      table:{
        code:"协议编码",
        name:"协议名称",

      }
    },

  },
  productType: {
    //商品分类
    list:{
      queryForm: {
        parentName:"上级分类",
        name:"分类名称",
      },
      queryFormTip:{
        name:"请输入分类名称"
      }
      ,
      table:{
        ioc:"分类图片",
        name:"分类名称",

      }
    },

  },
  shopSku: {
    //商品分类
    list:{
      queryForm: {
        parentName:"上级Sku",
        name:"SKU名称",
      },
      queryFormTip:{
        name:"请输入SKU名称"
      }
      ,
      table:{
        name:"SKU名称",

      }
    },
  },
  product: {
    //商品分类
    list:{
      queryForm: {
        name:"名称:",
        productCode:"编码:",
        hasUp:"上/下架:",
        up:"上架",
        down:"下架",
        productType:"分类:",
        productSort:"排序:",
        productSortOption:{
          stockNum:"总库存",
          salesNum:"销量",
          score:"评分",
          collect:"收藏数"
        }
      },
      queryFormTip:{
        name:"请输入商品名称",
        productCode:"请输入编码",
      }
      ,
      btn:{
        publishProduct: "发布产品"
      },
      table:{
        name:"商品名称",
        code:"商品编码",
        productTypeName:"商品分类名称",
        productPrice:"商品售价(KS)",
        productCost:"商品成本价(KS)",
        productProfit:"商品利润(KS)",
        stockNum:"总库存",
        salesNum:"销量",
        score:"评分",
        collect:"收藏",
        hasCarefullyChosen:"是否严选",
        compScore:"综合评分",
        hasUp:"上架状态",
        upStatus:"上架",
        downStatus:"下架",
      }
    },
    addOrEdit:{
      productTypeName:"商品分类:",
      productBanner:"商品主图:",
      productPrice:"商品售价:",
      productCost:"商品成本:",
      productSKU: "商品规格:",
      hasCarefullyChosen:"是否严选:",
      productInfo:"商品详情:",
      upStatus:"上架状态:",
      addSku:"添加规格",
      skuPpic:"sku图片",
      salePrice:"销售价",
      oriPrice:"市场价",
      stockNum:"库存",
      weight:"商品重量(kg)",
      volume:"商品体积(m³)",
      relatedProduct:"关联商品:",
      transTemplate:"运费模板:",
      deliveryMethod:"配送方式:",
      deliveryMethodSelfGotShop:"",
      deliveryMethodDelivery:"物流配送"
    },
    addOrEditTip:{
      productPrice:"请输入商品售价",
      productCost:"请输入商品成本",
      speceName:"请选择规格名",
      skuName:"请选择规格值",
      deliveryMethod:"请选择配送方式",
      selectProduct:"选择商品",

    },
  },
  trans: {
    //运费模板
    list:{
      queryForm: {
        name:"模板名称",
      },
      queryFormTip:{
        name:"请输入模板名称"
      }
      ,
      table:{
        name:"模板名称",
        chargeType:"收费方式",
        hasFreeFee:"是否包邮",
        hasDefault:"默认运费模板",
        chargeTypeNum:"按件数",
        chargeTypeWeight:"按重量",
        chargeTypeVolume:" 按体积"
      }
    },
    addOrEdit: {
      name:"模板名称:",
      hasFreeFee:"运费模板类型:",
      chargeType:"收费方式:",
      hasDefault: "默认模板:"
    },
    addOrEditTip:{
      name:"请输入模板名称",
      hasFreeFee:"包邮",
      nothasFreeFee:"不包邮",
      cityTitle:"选择区域",
      transArea:"配送区域",
      notNull:"不能位空",
      addTransfee:"点击添加可配送的区域和运费",
      hasFreeCondition:"指定条件包邮",
      freeCityLabel:"指定区域",
      selectCityList:"请选择指定包邮城市",
      freeFeeCondition:"设置包邮条件",
      freeTypeOne:"满件/重量/体积包邮",
      freeTypeTwo:"满金额包邮",
      freeTypeTwoInput:"元包邮",
      freeTypeOneInput:"件/重量/体积包邮",
      full:"满",
      freeConditionBtn:"点击添加指定包邮条件",
      nameEmpty:"模板名称不能为空",
      firstNum: "首件(件)",
      firstWeight: "首重(kg)",
      firstVolume: "首体积(m³)",
      continuousNum: "续件(件)",
      continuousWeight: "续重(kg)",
      continuousVolume: "续体积(m³)",
      transPrice: "运费(KS)",
      continuousPrice: "续费(KS)",
      freeArea:"可配送区域",
      allArea:"所有区域",
    }
  },
  order: {
    //订单
    list:{
      queryForm: {
        orderCode:"订单编号:",
        orderTime:"下单时间:",
        conactName:"联系姓名:",
        contactPhone:"联系手机:",
        orderStatus:"订单状态:",
        userName:"用户姓名:"
      },
      queryFormTip:{
        orderCode:"请输入订单号",
        conactName:"请输入联系人姓名",
        contactPhone:"请输入联系人手机号",
        orderStatus:"请输入订单状态",
        userName:"请输入用户姓名"

      }
      ,
      table:{
        name:"SKU名称",

      }
    },
  },
  home:{
    totalProduct:"商品总数",
    upProduct:"上架商品",
    totalOrder:"总订单",
    notFinshOrder:"未完成订单",
    totalPrice:"交易金额",
    priceText:"交易金额(KS)"
  }
}
