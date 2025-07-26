/**
 * 下拉
 * @type {string}
 * @private
 */
import i18n from '../i18n/index';


var varConfig = {
  cmsType: [{
    name:i18n.t('baseCms.option.cmsType.privateAgreement'),
    key:10
  },{
    name:i18n.t('baseCms.option.cmsType.termService'),
    key:11
  },{
    name:i18n.t('baseCms.option.cmsType.logisticsPolicy'),
    key:12
  },{
    name:i18n.t('baseCms.option.cmsType.aboutMe'),
    key:13
  },{
    name:i18n.t('baseCms.option.cmsType.joinMe'),
    key:14
  } ,{
      name:i18n.t('baseCms.option.cmsType.register'),
      key:15
   },{
      name:i18n.t('baseCms.option.cmsType.refundRule'),
      key:16
    }
  ],
  productHasUpOption:[
    {
      name:i18n.t('product.list.queryForm.up'),
      key:1
    },
    {
      name:i18n.t('product.list.queryForm.down'),
      key:0
    }
  ],
  productSortOption:[
    {
      name:i18n.t('product.list.queryForm.productSortOption.stockNum'),
      key:'stock_num'
    },
    {
      name:i18n.t('product.list.queryForm.productSortOption.salesNum'),
      key:'sales_num'
    },
    {
      name:i18n.t('product.list.queryForm.productSortOption.score'),
      key:'score'
    },
    {
      name:i18n.t('product.list.queryForm.productSortOption.collect'),
      key:'collect'
    }
  ],
  deliveryMethodOption:[
    {
      name:i18n.t('product.addOrEdit.deliveryMethodDelivery'),
      key:'20'
    }
  ],
}
window.options = varConfig;
