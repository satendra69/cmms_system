import { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
// layouts
import MainLayout from "src/layouts/main";
// components
import { SplashScreen } from "src/components/loading-screen";

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import("src/pages/components"));
// FOUNDATION
const ColorsPage = lazy(() => import("src/pages/components/foundation/colors"));
const TypographyPage = lazy(() =>
  import("src/pages/components/foundation/typography")
);
const ShadowsPage = lazy(() =>
  import("src/pages/components/foundation/shadows")
);
const GridPage = lazy(() => import("src/pages/components/foundation/grid"));
const IconsPage = lazy(() => import("src/pages/components/foundation/icons"));
// MUI COMPONENTS
const AccordionPage = lazy(() => import("src/pages/components/mui/accordion"));
const AlertPage = lazy(() => import("src/pages/components/mui/alert"));
const AutocompletePage = lazy(() =>
  import("src/pages/components/mui/autocomplete")
);
const AvatarPage = lazy(() => import("src/pages/components/mui/avatar"));
const BadgePage = lazy(() => import("src/pages/components/mui/badge"));
const BreadcrumbsPage = lazy(() =>
  import("src/pages/components/mui/breadcrumbs")
);
const ButtonsPage = lazy(() => import("src/pages/components/mui/buttons"));
const CheckboxPage = lazy(() => import("src/pages/components/mui/checkbox"));
const ChipPage = lazy(() => import("src/pages/components/mui/chip"));
const DataGridPage = lazy(() => import("src/pages/components/mui/data-grid"));
const DialogPage = lazy(() => import("src/pages/components/mui/dialog"));
const ListPage = lazy(() => import("src/pages/components/mui/list"));
const MenuPage = lazy(() => import("src/pages/components/mui/menu"));
const PaginationPage = lazy(() =>
  import("src/pages/components/mui/pagination")
);
const PickersPage = lazy(() => import("src/pages/components/mui/pickers"));
const PopoverPage = lazy(() => import("src/pages/components/mui/popover"));
const ProgressPage = lazy(() => import("src/pages/components/mui/progress"));
const RadioButtonsPage = lazy(() =>
  import("src/pages/components/mui/radio-button")
);
const RatingPage = lazy(() => import("src/pages/components/mui/rating"));
const SliderPage = lazy(() => import("src/pages/components/mui/slider"));
const StepperPage = lazy(() => import("src/pages/components/mui/stepper"));
const SwitchPage = lazy(() => import("src/pages/components/mui/switch"));
const TablePage = lazy(() => import("src/pages/components/mui/table"));
const TabsPage = lazy(() => import("src/pages/components/mui/tabs"));
const TextFieldPage = lazy(() => import("src/pages/components/mui/textfield"));
const TimelinePage = lazy(() => import("src/pages/components/mui/timeline"));
const TooltipPage = lazy(() => import("src/pages/components/mui/tooltip"));
const TransferListPage = lazy(() =>
  import("src/pages/components/mui/transfer-list")
);
const TreesViewPage = lazy(() => import("src/pages/components/mui/tree-view"));
// EXTRA COMPONENTS
const AnimatePage = lazy(() => import("src/pages/components/extra/animate"));
const CarouselsPage = lazy(() => import("src/pages/components/extra/carousel"));
const ChartPage = lazy(() => import("src/pages/components/extra/chart"));
const CopyToClipboardPage = lazy(() =>
  import("src/pages/components/extra/copy-to-clipboard")
);
const EditorPage = lazy(() => import("src/pages/components/extra/editor"));
const FormValidationPage = lazy(() =>
  import("src/pages/components/extra/form-validation")
);
const ImagePage = lazy(() => import("src/pages/components/extra/image"));
const LabelPage = lazy(() => import("src/pages/components/extra/label"));
const LightboxPage = lazy(() => import("src/pages/components/extra/lightbox"));
const MapPage = lazy(() => import("src/pages/components/extra/map"));
const MegaMenuPage = lazy(() => import("src/pages/components/extra/mega-menu"));
const MultiLanguagePage = lazy(() =>
  import("src/pages/components/extra/multi-language")
);
const NavigationBarPage = lazy(() =>
  import("src/pages/components/extra/navigation-bar")
);
const OrganizationalChartPage = lazy(() =>
  import("src/pages/components/extra/organization-chart")
);
const ScrollbarPage = lazy(() => import("src/pages/components/extra/scroll"));
const SnackbarPage = lazy(() => import("src/pages/components/extra/snackbar"));
const TextMaxLinePage = lazy(() =>
  import("src/pages/components/extra/text-max-line")
);
const UploadPage = lazy(() => import("src/pages/components/extra/upload"));
const MarkdownPage = lazy(() => import("src/pages/components/extra/markdown"));
const ScrollProgressPage = lazy(() =>
  import("src/pages/components/extra/scroll-progress")
);

// ----------------------------------------------------------------------

export const componentsRoutes = [
  {
    element: (
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    ),
    children: [
      {
        path: "components",
        children: [{ element: <IndexPage />, index: true }],
      },
    ],
  },
];
