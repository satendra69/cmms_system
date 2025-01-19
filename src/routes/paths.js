// utils
import { paramCase } from "src/utils/change-case";
import { _id, _postTitles } from "src/_mock/assets";

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  page403: "/403",
  page404: "/404",
  page500: "/500",
  components: "/components",

  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    summary:{
      root: `${ROOTS.DASHBOARD}/summary`,
    },
    asset: {
      root: `${ROOTS.DASHBOARD}/list`,
      list: `${ROOTS.DASHBOARD}/asset/list`,
      newasset: `${ROOTS.DASHBOARD}/asset/newassetFrom`,
      editasset: `${ROOTS.DASHBOARD}/asset/newassetFrom`,
      assetReport: `${ROOTS.DASHBOARD}/asset/assetlistReport`,
      assetPrintQr: `${ROOTS.DASHBOARD}/asset/PrintQrCode`,
    },
    work: {
      root: `${ROOTS.DASHBOARD}/list`,
      list: `${ROOTS.DASHBOARD}/work/list`,
      order: `${ROOTS.DASHBOARD}/work/order`,
      neworder: `${ROOTS.DASHBOARD}/work/neworderFrom`,
      editworkorder: `${ROOTS.DASHBOARD}/work/neworderFrom`,
      newRequest: `${ROOTS.DASHBOARD}/work/newreqestFrom`,
      editrequest: `${ROOTS.DASHBOARD}/work/newreqestFrom`,
      testorder: `${ROOTS.DASHBOARD}/work/WorkOrderTestForm`,
    },
    MaterialRequest:{
      list: `${ROOTS.DASHBOARD}/MaterialRequest/list`,
      newmaterialrequest: `${ROOTS.DASHBOARD}/MaterialRequest/newmaterialrequest`,
      editmaterialrequest: `${ROOTS.DASHBOARD}/MaterialRequest/newmaterialrequest`,
    },
    PurchaseRequest:{
      list: `${ROOTS.DASHBOARD}/PurchaseRequest/list`,
      newpurchaserequest: `${ROOTS.DASHBOARD}/MaterialRequest/newpurchaserequest`,
      editpurchaserequest: `${ROOTS.DASHBOARD}/MaterialRequest/newpurchaserequest`,
    },
    Procurement:{
      supplier:`${ROOTS.DASHBOARD}/SupplierMaster/list`,
      newsupplier: `${ROOTS.DASHBOARD}/SupplierMaster/newsupplier`,
      editsupplier: `${ROOTS.DASHBOARD}/SupplierMaster/newsupplier`, 

    },
    PreventiveSetup: {
      root: `${ROOTS.DASHBOARD}/list`,
      list: `${ROOTS.DASHBOARD}/PreventiveSetup/Maintenance`,
      newpmform: `${ROOTS.DASHBOARD}/PreventiveSetup/newpmform`,
    },
    InventoryMaster: {
      root: `${ROOTS.DASHBOARD}/list`,
      list: `${ROOTS.DASHBOARD}/InventoryMaster/list`,
      inventoryform: `${ROOTS.DASHBOARD}/InventoryMaster/inventoryform`,
     // assetReport: `${ROOTS.DASHBOARD}/asset/assetlistReport`,
    },
    
  },
};
