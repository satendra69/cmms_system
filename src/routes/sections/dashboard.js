import { lazy, Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
// auth
import { AuthGuard } from "src/auth/guard";
// layouts
import DashboardLayout from "src/layouts/dashboard";
// components
import { LoadingScreen } from "src/components/loading-screen";
import SystemDefaultSetup from "src/sections/master-file-setup/MasterSetup";
import AutoNoList from "src/sections/master-file-setup/MasterAssetNo/AutoNoList";
import CraftCodeList from "src/sections/master-file-setup/MasterCraftCode/CraftCodeList";
import AccountPeriodList from "src/sections/master-file-setup/AccountingPeriod/AccountPeriodList";
import MasterGroupList from "src/sections/master-file-setup/MasterUserGroup/MasterGroupList";
import MasterCategoryStatusList from "src/sections/master-file-setup/MasterCategoryStatus/MasterCategoryStatusList";
import StatusTypeList from "src/sections/master-file-setup/MasterStatusType/StatusTypeList";
import CostCenterList from "src/sections/master-file-setup/MasterCostCenter/CostCenterList";
import AccountList from "src/sections/master-file-setup/MasterAccount/AccountList";
import CurrencyList from "src/sections/master-file-setup/CurrencyCode/CurrencyList";
import TaxCodeList from "src/sections/master-file-setup/TaxCode/TaxCodeList";
import BudgetList from "src/sections/master-file-setup/Budget/BudgetList";
import BudgetADDDialog from "src/sections/master-file-setup/Budget/BudgetADDDialog";
import DashboardSummary from "src/sections/overview/app/view/dashboard-summary";
import EmployeList from "src/sections/people/employee/EmployeList";
import EmployeForm from "src/sections/people/employee/Form/EmployeForm";
import UserList from "src/sections/user_login/UserListView/UserList";
import UserForm from "src/sections/user_login/Form/UserForm";
import MangementDashboard from "src/sections/kpi_report/managemant/MangementDashboard"
import MasterAssetStatus from "src/sections/master-file-setup/MasterAssetStatus/MasterAssetStatus";
import MasterAssetCri from "src/sections/master-file-setup/MasterAssetCriticalFactor/MasterAssetCritical"
import MasterAssetCode from "../../sections/master-file-setup/MasterAssetCode/MasterAssetCode";
import MasterAssetGrpCode from "../../sections/master-file-setup/MasterAssetGrpCode/MasterAssetGrpCode";
import MasterAssetWrkArea from "src/sections/master-file-setup/MasterAssetWrkArea/MasterAssetWrkArea";
import MasterAssetLevel from "../../sections/master-file-setup/MasterAssetLevel/MasterAssetLevel";
import MasterAssetLocation from "../../sections/master-file-setup/MasterAssetLocation/MasterAssetLocation";
import HirechyMain from "src/sections/AssetHirechy/HirechyMain";
import MasterAssetType from "src/sections/master-file-setup/MasterAssetType/MasterAssetType";
import OpenAndClose  from "src/sections/kpi_report/openclose/OpenAndClose";
import ProProvider from "src/sections/procurement/Supplier_master/ProContext";
import SupplierList from "src/sections/procurement/Supplier_master/SupplierList";
import SupplierForm from "src/sections/procurement/Supplier_master/Form/SupplierForm";
import Maintence_List from "src/sections/maintenance/Material_Request/Maintence_List";
import Purchase_List from "src/sections/procurement/Purchase_Request/Purchase_List";
import Preventive_List from "src/sections/PreventiveMaintenance/Preventive_List";
import TableList from "src/sections/SystemAdminstrator/Site/TableList"

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import("src/pages/dashboard/app"));
const OverviewEcommercePage = lazy(() =>
  import("src/pages/dashboard/ecommerce")
);
const OverviewAnalyticsPage = lazy(() =>
  import("src/pages/dashboard/analytics")
);
const OverviewBankingPage = lazy(() => import("src/pages/dashboard/banking"));
const OverviewBookingPage = lazy(() => import("src/pages/dashboard/booking"));
const OverviewFilePage = lazy(() => import("src/pages/dashboard/file"));
// PRODUCT
const ProductDetailsPage = lazy(() =>
  import("src/pages/dashboard/product/details")
);
const ProductListPage = lazy(() => import("src/pages/dashboard/product/list"));
const ProductCreatePage = lazy(() => import("src/pages/dashboard/product/new"));
const ProductEditPage = lazy(() => import("src/pages/dashboard/product/edit"));
// ORDER
const OrderListPage = lazy(() => import("src/pages/dashboard/order/list"));
const OrderDetailsPage = lazy(() =>
  import("src/pages/dashboard/order/details")
);
// INVOICE
const InvoiceListPage = lazy(() => import("src/pages/dashboard/invoice/list"));
const InvoiceDetailsPage = lazy(() =>
  import("src/pages/dashboard/invoice/details")
);
const InvoiceCreatePage = lazy(() => import("src/pages/dashboard/invoice/new"));
const InvoiceEditPage = lazy(() => import("src/pages/dashboard/invoice/edit"));
// USER
const UserProfilePage = lazy(() => import("src/pages/dashboard/user/profile"));
const UserCardsPage = lazy(() => import("src/pages/dashboard/user/cards"));
const UserListPage = lazy(() => import("src/pages/dashboard/user/list"));
const UserAccountPage = lazy(() => import("src/pages/dashboard/user/account"));
const UserCreatePage = lazy(() => import("src/pages/dashboard/user/new"));
const UserEditPage = lazy(() => import("src/pages/dashboard/user/edit"));

// ASSET
const AssetList = lazy(() => import("src/sections/Asset/Asset_List"));
const AssetNewFrom = lazy(() =>
  import("src/sections/Asset/Form/CreateAssetFrom")
);
const AssetListReport = lazy(() =>
  import("src/sections/Asset/Asset_report/AssetListReport")
);
const AssetPrintQrCode = lazy(() =>
  import("src/sections/Asset/Asset_QrcodePrint/AssetPrintQrCode")
);
//Preventive Setup
const PreventiveMaintenance = lazy(() =>
  import("src/sections/Preventive_setup/PreventiveMaintenance")
);
const PreventiveMaintenanceForm = lazy(() =>
  import("src/sections/Preventive_setup/Form/CreateNewPmform")
);

// Inventory Master
const InventoryMasterList = lazy(() =>
  import("src/sections/Inventory/InventoryMaster/InventoryMasterList")
);
const InventoryMasterForm = lazy(() =>
  import("src/sections/Inventory/InventoryMaster/Form/InventoryForm")
);
// Mantinance
const WorkReqList = lazy(() =>
  import("src/sections/maintenance/WorkRequestList")
);
const WorkOrderList = lazy(() =>
  import("src/sections/maintenance/WorkOrderList")
);
const WorkOrderNewFrom = lazy(() =>
  import("src/sections/maintenance/Form/WorkOrderNewFrom")
);
const WorkRequestForm = lazy(() =>
  import("src/sections/maintenance/Form/WorkRequestForm")
);

// Material Request
const MRForm = lazy(() =>
  import("src/sections/maintenance/Material_Request/Form/CreateMRFrom")
);
// Purchase Request
const PRForm = lazy(() =>
  import("src/sections/procurement/Purchase_Request/Form/CreatePRFrom")
);
const Site = lazy(() =>
  import("src/sections/SystemAdminstrator/Site/TableList")
);
const SiteForm = lazy(() =>
  import("src/sections/SystemAdminstrator/Site/Form/Form")
);

const PasswordPolicyList = lazy(() =>
  import("src/sections/SystemAdminstrator/PasswordPolicy/TableList")
);

const PasswordPolicyForm = lazy(() =>
  import("src/sections/SystemAdminstrator/PasswordPolicy/Form/Form")
);


// BLOG
const BlogPostsPage = lazy(() => import("src/pages/dashboard/post/list"));
const BlogPostPage = lazy(() => import("src/pages/dashboard/post/details"));
const BlogNewPostPage = lazy(() => import("src/pages/dashboard/post/new"));
const BlogEditPostPage = lazy(() => import("src/pages/dashboard/post/edit"));
// JOB
const JobDetailsPage = lazy(() => import("src/pages/dashboard/job/details"));
const JobListPage = lazy(() => import("src/pages/dashboard/job/list"));
const JobCreatePage = lazy(() => import("src/pages/dashboard/job/new"));
const JobEditPage = lazy(() => import("src/pages/dashboard/job/edit"));
// TOUR
const TourDetailsPage = lazy(() => import("src/pages/dashboard/tour/details"));
const TourListPage = lazy(() => import("src/pages/dashboard/tour/list"));
const TourCreatePage = lazy(() => import("src/pages/dashboard/tour/new"));
const TourEditPage = lazy(() => import("src/pages/dashboard/tour/edit"));
// FILE MANAGER
const FileManagerPage = lazy(() => import("src/pages/dashboard/file-manager"));
// APP
const ChatPage = lazy(() => import("src/pages/dashboard/chat"));
const MailPage = lazy(() => import("src/pages/dashboard/mail"));
const CalendarPage = lazy(() => import("src/pages/dashboard/calendar"));
const KanbanPage = lazy(() => import("src/pages/dashboard/kanban"));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() =>
  import("src/pages/dashboard/permission")
);
// BLANK PAGE
const BlankPage = lazy(() => import("src/pages/dashboard/blank"));

// ----------------------------------------------------------------------
const PrivateRoute = ({ children }) => {
  const UserLoginId = localStorage.getItem("emp_mst_login_id");

  if (!UserLoginId) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
         
          <ProProvider>
         
            <Outlet />
            
            </ProProvider>
          
          </Suspense>
        </DashboardLayout>
      </PrivateRoute>
    ),

    children: [
      { element: <IndexPage />, index: true },
      { path: "ecommerce", element: <OverviewEcommercePage /> },
      { path: "analytics", element: <OverviewAnalyticsPage /> },
      { path: "banking", element: <OverviewBankingPage /> },
      { path: "booking", element: <OverviewBookingPage /> },
      { path: "file", element: <OverviewFilePage /> },
      {
        path: "user",
        children: [
          { element: <UserProfilePage />, index: true },
          { path: "profile", element: <UserProfilePage /> },
          { path: "cards", element: <UserCardsPage /> },
          { path: "list", element: <UserListPage /> },
          { path: "new", element: <UserCreatePage /> },
          { path: ":id/edit", element: <UserEditPage /> },
          { path: "account", element: <UserAccountPage /> },
        ],
      },
      {
        path: "summary",
        children: [
          { element: <DashboardSummary />, index: true },

          { path: "summary", element: <DashboardSummary /> },
        ],
      },
      {
        path: "asset",
        children: [
          { element: <AssetList />, index: true },

          { path: "list", element: <AssetList /> },
          { path: "newasset", element: <AssetNewFrom /> },
          { path:"editasset", element: <AssetNewFrom />},
          { path: "assetReport", element: <AssetListReport /> },
          { path: "assetPrintQr", element: <AssetPrintQrCode /> },
          { path: "asset-hirechy", element: <HirechyMain /> },
        ],
      },
      {
        path: "work",
        children: [
          { element: <WorkReqList />, index: true },
          { path: "list", element: <WorkReqList /> },
          { path: "order", element: <WorkOrderList /> },
          { path: "neworder", element: <WorkOrderNewFrom /> },
          { path: "editworkorder", element: <WorkOrderNewFrom /> },
          { path: "testorder", element: <WorkOrderNewFrom /> },
          { path: "newRequest", element: <WorkRequestForm /> },
          { path: "editrequest", element: <WorkRequestForm /> },
        ],
      },
      // maintence request
      {
        path: "MaterialRequest",
        children: [
          { element: <Maintence_List />, index: true },
          { path: "list", element: <Maintence_List /> },
          { path: "newmaterialrequest", element: <MRForm /> },
          { path: "editmaterialrequest", element: <MRForm /> },
         
        ],
      },
      // Purchase Request
      {
        path: "PurchaseRequest",
        children: [
          { element: <Purchase_List />, index: true },
          { path: "list", element: <Purchase_List /> },
          { path: "newpurchaserequest", element: <PRForm /> },
          { path: "editpurchaserequest", element: <PRForm /> },
         
        ],
      },

// Preventive maintence
{
  path: "preventive-maintenance",
  children: [
  { element: <Preventive_List />, index: true },
  { path: "preventive-list", element: <Preventive_List /> },  
     ],
      },

      {
        path: "PreventiveSetup",
        children: [
          { element: <PreventiveMaintenance />, index: true },
          { path: "Maintenance", element: <PreventiveMaintenance /> },
          { path: "newpmform", element: <PreventiveMaintenanceForm /> },
        ],
      },
      {
        path: "InventoryMaster",
        children: [
          { element: <InventoryMasterList />, index: true },
          { path: "list", element: <InventoryMasterList /> },
          { path: "inventoryform", element: <InventoryMasterForm /> },
        ],
      },
      // procurement
      {
        path: "Procurement",
        children: [
        { element: <SupplierList />, index: true },
        { path: "supplier", element: <SupplierList /> },
        { path: "newsupplier", element: <SupplierForm  /> },
        { path: "editsupplier", element: <SupplierForm /> },
        ],
      },
{
  path: "system-admin",
  children: [
    // This is the index route for "system-admin"
    { element: <TableList />, index: true },

    // Nested "site" route with its own child routes
    { 
      path: "site", 
      element: <TableList />,
  
       
   
    },
    { path: "site/form", element: <SiteForm /> },

    // Second path: "password-policy" with nested "form" route
    {
      path: "password-policy",
      element: <PasswordPolicyList />,
     
    },
    { path: "password-policy/form", element: <PasswordPolicyForm /> }
      ]
    },

      {
        path: "product",
        children: [
          { element: <ProductListPage />, index: true },
          { path: "list", element: <ProductListPage /> },
          { path: ":id", element: <ProductDetailsPage /> },
          { path: "new", element: <ProductCreatePage /> },
          { path: ":id/edit", element: <ProductEditPage /> },
        ],
      },
      {
        path: "order",
        children: [
          { element: <OrderListPage />, index: true },
          { path: "list", element: <OrderListPage /> },
          { path: ":id", element: <OrderDetailsPage /> },
        ],
      },
      {
        path: "invoice",
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: "list", element: <InvoiceListPage /> },
          { path: ":id", element: <InvoiceDetailsPage /> },
          { path: ":id/edit", element: <InvoiceEditPage /> },
          { path: "new", element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: "post",
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: "list", element: <BlogPostsPage /> },
          { path: ":title", element: <BlogPostPage /> },
          { path: ":title/edit", element: <BlogEditPostPage /> },
          { path: "new", element: <BlogNewPostPage /> },
        ],
      },
      {
        path: "job",
        children: [
          { element: <JobListPage />, index: true },
          { path: "list", element: <JobListPage /> },
          { path: ":id", element: <JobDetailsPage /> },
          { path: "new", element: <JobCreatePage /> },
          { path: ":id/edit", element: <JobEditPage /> },
        ],
      },
      {
        path: "tour",
        children: [
          { element: <TourListPage />, index: true },
          { path: "list", element: <TourListPage /> },
          { path: ":id", element: <TourDetailsPage /> },
          { path: "new", element: <TourCreatePage /> },
          { path: ":id/edit", element: <TourEditPage /> },
        ],
      },

    // master file setup
  // master file setup
  {
    path: "masterfile",
    children: [
      { element: <SystemDefaultSetup />, index: true },
      { path: "default-settings", element: <SystemDefaultSetup /> },
      { path: "master-user-group", element: <MasterGroupList /> },
      { path: "master-auto-no", element: <AutoNoList /> },
      { path: "craft-code", element: <CraftCodeList /> },
      { path: "accounting-peroid", element: <AccountPeriodList /> },
      {
        path: "category-status-list",
        element: <MasterCategoryStatusList />,
      },
      {
        path: "status-type",
        element: <StatusTypeList />,
      },
      {
        path: "cost-center",
        element: <CostCenterList />,
      },
      {
        path: "account",
        element: <AccountList />,
      },
      {
        path: "currency-code",
        element: <CurrencyList />,
      },
      {
        path: "tax-code",
        element: <TaxCodeList />,
      },

      {
        path: "asset-type",
        element: <MasterAssetType />,
      },

      {
        path: "asset-status",
        element: <MasterAssetStatus />,
      },

      {
        path: "asset-cri",
        element: <MasterAssetCri />,
      },

      {
        path: "asset-code",
        element: <MasterAssetCode />,
      },
      {
        path: "asset-grp-code",
        element: <MasterAssetGrpCode />,
      },

      {
        path: "asset-wrk-area",
        element: <MasterAssetWrkArea />,
      },

      {
        path: "asset-level",
        element: <MasterAssetLevel />,
      },

      
      {
        path: "asset-location",
        element: <MasterAssetLocation />,
      },       
      
      {
        path: "budget",

        children: [
          { element: <BudgetList />, index: true },

          {
            path: "new",
            element: <BudgetADDDialog />,
          },
        ],
      },
    ],
  },

    {
      path: "people",
      children: [
        { element: <EmployeList />, index: true },

        { path: "employ-list", element: <EmployeList /> },
        { path: "employe-new", element: <EmployeForm /> },
        { path: "editemployee", element: <EmployeForm /> },
        { path: "assetReport", element: <AssetListReport /> },
        { path: "assetPrintQr", element: <AssetPrintQrCode /> },
      ],
    },
    {
      path: "user",
      children: [
        { element: <UserList />, index: true },

        { path: "user-list", element: <UserList /> },
        { path: "user-form", element: <UserForm/> },

      ],
    },
    {
      path: "kpi-report",
      children: [
        { element: <MangementDashboard />, index: true },

        { path: "managemnet", element: <MangementDashboard /> },
        { path: "open-close", element: <OpenAndClose /> },
       

      ],
    },

      { path: "file-manager", element: <FileManagerPage /> },
      { path: "mail", element: <MailPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "kanban", element: <KanbanPage /> },
      { path: "permission", element: <PermissionDeniedPage /> },
      { path: "blank", element: <BlankPage /> },
    ],
  },
];
