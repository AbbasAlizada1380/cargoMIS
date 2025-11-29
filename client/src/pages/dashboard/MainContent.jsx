// import Customer from "./pages/ServiceManger";
import Dashboard from "./pages/dashboard";
// import S_Transaction from "./pages/RentManager";
import Report from "./pages/reports";
import AddUser from "./pages/AddUser";
import MenuManagement from "./pages/MenuManagement";
import Packages from "./pages/Packages";
import PackageList from "./pages/PackageList";
import ZoneManager from "./pages/management/ZoneManager";
import TransitWayManager from "./pages/management/TranistWayManager";
import PriceListManager from "./pages/management/PriceList";
const MainContent = ({ activeComponent }) => {
  const renderContent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "ZoneManagement":
        return <ZoneManager />;
      case "TransitWayManagement":
        return <TransitWayManager />;
      case "PriceListManagement":
        return <PriceListManager />;
      case "BlockManager":
        return <BlockManager />;
      case "user managements":
        return <UserManagement />;
      case "report":
        return <Report />;
      case "Salaries":
        return <Salaries />;
      case "setting":
        return <Setting />;
      case "ServiceManager":
        return <ServiceManager />;
      case "Fees":
        return <Fees />;
      case "Packages":
        return <Packages />;
      case "PackageList":
        return <PackageList />;
      case "AddUser":
        return <AddUser />;

      default:
        return <Dashboard />;
    }
  };

  return <div className="min-h-[90vh]">{renderContent()}</div>;
};

export default MainContent;
