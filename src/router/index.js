import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "首页",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" }
      }
    ]
  },
  //   {
  //     path: "/system/dict-data",
  //     component: Layout,
  //     children: [
  //       {
  //         path: "index/:dictId(\\d+)",
  //         component: () => import("@/views/sys/dic/data"),
  //         name: "字典数据",
  //         meta: { title: "字典数据", icon: "字典数据" },
  //         hidden: true
  //       },
  //     ],
  //   },
  {
    path: "/product",
    name: "商品管理",
    component: Layout,
    children: [
      {
        path: "list",
        name: "商品管理列表",
        component: () => import("@/views/product/product/index"),
        meta: { title: "商品管理", icon: "商品管理" }
      },
      {
        path: "addOrUpdate",
        name: "发布/编辑商品",
        component: () => import("@/views/product/product/addOrUpdate"),
        meta: { title: "发布/编辑商品", icon: "发布/编辑商品" }
      },
      {
        path: "productType",
        name: "商品分类",
        component: () => import("@/views/product/type/index"),
        meta: { title: "商品分类", icon: "商品分类" }
      },
      {
        path: "sku",
        name: "SKU管理",
        component: () => import("@/views/product/sku/index"),
        meta: { title: "SKU管理", icon: "SKU管理" }
      },
      {
        path: "specification",
        name: "商品规格",
        component: () => import("@/views/product/sku/index"),
        meta: { title: "商品规格", icon: "商品规格" }
      }
    ]
  },
  {
    //商品配置模块
    path: "/base",
    name: "商品配置",
    component: Layout,
    children: [
      {
        path: "cms",
        name: "协议管理",
        component: () => import("@/views/base/cms"),
        meta: { title: "协议管理", icon: "协议管理" }
      },
      {
        path: "trans",
        name: "运费模板",
        component: () => import("@/views/base/trans"),
        meta: { title: "运费模板", icon: "运费模板" }
      },
      {
        path: "trans/addOrUpdate",
        name: "新增/编辑运费模板",
        component: () => import("@/views/base/trans/addOrUpdate"),
        meta: { title: "新增/编辑运费模板", icon: "新增/编辑运费模板" }
      }
    ]
  },
  {
    //订单管理
    path: "/order",
    name: "订单管理",
    component: Layout,
    children: [
      {
        path: "list",
        name: "订单管理",
        component: () => import("@/views/order/index"),
        meta: { title: "订单管理", icon: "订单管理" }
      }
    ]
  },
  {
    //会员管理
    path: "/user",
    name: "会员管理",
    component: Layout,
    children: [
      {
        path: "list",
        name: "会员管理",
        component: () => import("@/views/user/index"),
        meta: { title: "会员管理", icon: "会员管理" }
      }
    ]
  },
  {
    //系统参数管理
    path: "/upms",
    name: "系统管理",
    component: Layout,
    children: [
      {
        path: "group",
        name: "用户组管理",
        component: () => import("@/views/upms/group/index"),
        meta: { title: "用户组管理", icon: "用户组管理" }
      },
      {
        path: "role",
        name: "角色管理",
        component: () => import("@/views/upms/role/index"),
        meta: { title: "角色管理", icon: "角色管理" }
      },
      {
        path: "depart",
        name: "部门管理",
        component: () => import("@/views/upms/depart/index"),
        meta: { title: "部门管理", icon: "部门管理" }
      },
      {
        path: "auth",
        name: "权限管理",
        component: () => import("@/views/upms/auth/index"),
        meta: { title: "权限管理", icon: "权限管理" }
      },
      {
        path: "user",
        name: "用户管理",
        component: () => import("@/views/sys/user/index"),
        meta: { title: "用户管理", icon: "用户管理" }
      },
      {
        path: "function",
        name: "资源管理",
        component: () => import("@/views/upms/function/index"),
        meta: { title: "资源管理", icon: "资源管理" }
      }
    ]
  },
  {
    //系统参数管理
    path: "/system",
    name: "系统管理",
    component: Layout,
    children: [
      {
        path: "qualificationConfiguration",
        name: "资质配置",
        component: () => import("@/views/sys/qualificationConfiguration/index"),
        meta: { title: "资质配置", icon: "资质配置" }
      },
      {
        path: "qualificationDetail",
        component: () => import("@/views/auditing/qualificationReview/detail"),
        name: "资质审核详情",
        meta: { title: "资质审核详情", icon: "资质审核详情" },
        hidden: true
      },
      {
        path: "surgicalCode",
        name: "手术编码更新",
        component: () => import("@/views/sys/surgicalCode/index"),
        meta: { title: "手术编码更新", icon: "手术编码更新" }
      },
      {
        path: "operlog",
        name: "操作日志",
        component: () => import("@/views/sys/operlog/index"),
        meta: { title: "操作日志", icon: "操作日志" }
      },
      {
        path: "dic",
        name: "字典管理",
        component: () => import("@/views/sys/dic/index"),
        meta: { title: "字典管理", icon: "字典管理" }
      },
      {
        path: "data",
        component: () => import("@/views/sys/dic/data"),
        name: "字典子项",
        meta: { title: "字典子项", icon: "字典子项" },
        hidden: true
      },
      {
        path: "param",
        name: "参数管理",
        component: () => import("@/views/sys/param/index"),
        meta: { title: "参数管理", icon: "参数管理" }
      },
      {
        path: "frameworkErrorMessage",
        name: "APP提示语管理",
        component: () => import("@/views/sys/errorMessage/index"),
        meta: { title: "APP提示语管理", icon: "APP提示语管理" }
      },
      {
        path: "qualificationCatalogue",
        name: "资质目录",
        component: () => import("@/views/sys/qualificationCatalogue/index"),
        meta: { title: "资质目录", icon: "资质目录" }
      },
      {
        path: "certificateDirectory",
        name: "证书目录",
        component: () => import("@/views/sys/certificateDirectory/index"),
        meta: { title: "证书目录", icon: "证书目录" }
      },
      {
        path: "qualificationManagement",
        name: "资质管理",
        component: () => import("@/views/sys/qualificationManagement/index"),
        meta: { title: "资质管理", icon: "资质管理" }
      },
      {
        path: "qualificationCatalogue",
        name: "资质配置",
        component: () => import("@/views/sys/qualificationCatalogue/index"),
        meta: { title: "资质配置", icon: "资质配置" }
      }
    ]
  },
  {
    path: "/auditing",
    name: "资质审核",
    component: Layout,
    children: [
      {
        path: "qualificationLog",
        name: "资质审核日志",
        component: () => import("@/views/auditing/qualificationLog/index"),
        meta: { title: "资质审核日志", icon: "资质审核日志" }
      },
      {
        path: "qualificationReview",
        name: "资质审核",
        component: () => import("@/views/auditing/qualificationReview/index"),
        meta: { title: "资质审核", icon: "资质审核" }
      },
      {
        path: "qualification-detail",
        component: () => import("@/views/auditing/qualificationReview/detail"),
        name: "资质审核详情",
        meta: { title: "资质审核详情", icon: "资质审核详情" }
      },
      {
        path: "qualificationBatches",
        name: "批量设置资质",
        component: () => import("@/views/auditing/qualificationBatches/index"),
        meta: { title: "批量设置资质", icon: "批量设置资质" }
      },
      {
        path: "employeeQualifications",
        name: "批量设置资质",
        component: () =>
          import("@/views/auditing/employeeQualifications/index"),
        meta: { title: "批量设置资质", icon: "批量设置资质" }
      },
      {
        path: "employeesAualifications",
        name: "员工与资质",
        component: () =>
          import("@/views/auditing/employeesAualifications/index"),
        meta: { title: "员工与资质", icon: "员工与资质" }
      },
      {
        path: "qualificationSetSurgery",
        name: "手术要求资质设置",
        component: () =>
          import("@/views/auditing/qualificationSetSurgery/index"),
        meta: { title: "手术要求资质设置", icon: "手术要求资质设置" }
      },
      {
        path: "operPermissionLog",
        name: "手术权限操作日志",
        component: () => import("@/views/auditing/operPermissionLog/index"),
        meta: { title: "手术权限操作日志", icon: "手术权限操作日志" }
      },
      {
        path: "operSafeguard",
        name: "手术基础包列表与维护",
        component: () => import("@/views/auditing/operSafeguard/index"),
        meta: { title: "手术基础包列表与维护", icon: "手术基础包列表与维护" }
      },
      {
        path: "doctorsPermissions",
        name: "医生临床权限列表",
        component: () => import("@/views/auditing/doctorsPermissions/index"),
        meta: { title: "医生临床权限列表", icon: "医生临床权限列表" }
      },
      {
        path: "auditAuthorization",
        name: "手术权限审核授权",
        component: () => import("@/views/auditing/auditAuthorization/index"),
        meta: { title: "手术权限审核授权", icon: "手术权限审核授权" }
      },
      {
        path: "auditAuthorization/details",
        name: "手术权限审核详情",
        component: () => import("@/views/auditing/auditAuthorization/details"),
        meta: { title: "手术权限审核授权", icon: "手术权限审核授权" }
      },
      {
        path: "rating/review",
        name: "手术级别考核授权",
        component: () => import("@/views/auditing/rating/review/index"),
        meta: { title: "手术级别考核授权", icon: "手术级别考核授权" }
      },
      {
        path: "rating/review/detail",
        name: "手术级别考核详情",
        component: () => import("@/views/auditing/rating/review/detail"),
        meta: { title: "手术级别考核详情", icon: "手术级别考核授权" }
      },
      {
        path: "highrisk/audit",
        name: "高风险诊疗技术审核",
        component: () => import("@/views/auditing/highrisk/audit/index"),
        meta: { title: "高风险诊疗技术审核", icon: "高风险诊疗技术审核" }
      },
      {
        path: "highrisk/audit/detail",
        name: "高风险诊疗技术审核详情",
        component: () => import("@/views/auditing/highrisk/audit/detail"),
        meta: { title: "高风险诊疗技术审核详情", icon: "高风险诊疗技术审核" }
      },
      {
        path: "rating/audit",
        name: "手术级别审核授权",
        component: () => import("@/views/auditing/rating/audit/index"),
        meta: { title: "手术级别审核授权", icon: "手术级别审核授权" }
      },
      {
        path: "rating/audit/detail",
        name: "手术级别审核详情",
        component: () => import("@/views/auditing/rating/audit/detail"),
        meta: { title: "手术级别审核授权", icon: "手术级别审核授权" }
      }
    ]
  },
  {
    path: "/myQualifications",
    component: Layout,
    children: [
      {
        path: "myQualifications",
        name: "我的资质",
        component: () =>
          import("@/views/myQualifications/myQualifications/index"),
        meta: { title: "我的资质", icon: "我的资质" }
      },
      {
        path: "educationTraining",
        name: "教育培训",
        component: () =>
          import("@/views/myQualifications/educationTraining/index"),
        meta: { title: "教育培训", icon: "教育培训" }
      },
      {
        path: "operApplication",
        name: "手术权限申请",
        component: () =>
          import("@/views/myQualifications/operApplication/index"),
        meta: { title: "手术权限申请", icon: "手术权限申请" }
      },
      {
        path: "operApplication-details",
        name: "手术权限申请",
        component: () =>
          import("@/views/myQualifications/operApplication/details"),
        meta: { title: "手术权限申请", icon: "手术权限申请" }
      },
      {
        path: "operInquiry",
        name: "手术权限查询",
        component: () => import("@/views/myQualifications/operInquiry/index"),
        meta: { title: "手术权限查询", icon: "手术权限查询" }
      },
      {
        path: "rating/manage",
        name: "手术级别申请",
        component: () => import("@/views/myQualifications/rating/manage/index"),
        meta: { title: "手术级别申请", icon: "手术级别申请" }
      },
      {
        path: "rating/details",
        name: "手术级别申请",
        component: () =>
          import("@/views/myQualifications/rating/manage/details"),
        meta: { title: "手术级别申请", icon: "手术级别申请" }
      },
      {
        path: "highrisk/manage",
        name: "高风险诊疗技术申请",
        component: () =>
          import("@/views/myQualifications/highrisk/manage/index"),
        meta: { title: "高风险诊疗技术申请", icon: "高风险诊疗技术申请" }
      },
      {
        path: "highrisk/details",
        name: "高风险诊疗技术申请",
        component: () =>
          import("@/views/myQualifications/highrisk/manage/details"),
        meta: { title: "高风险诊疗技术申请", icon: "高风险诊疗技术申请" }
      },
      {
        path: "highrisk/statistics",
        name: "高风险诊疗技术统计",
        component: () =>
          import("@/views/myQualifications/highrisk/statistics/index"),
        meta: { title: "高风险诊疗技术统计", icon: "高风险诊疗技术统计" }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
