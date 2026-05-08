import Sidebar from "../Sidebar";
import Header from "../Header";

type AppLayoutProps = {
  children: React.ReactNode;
  header: {
    title: string;
    tabs?: string[];
    activeTab?: string;
  };
};

export default function AppLayout({ children, header }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-light">
      
      <Sidebar />

      <div className="flex-1 p-10 overflow-y-auto">

        <Header
          title={header.title}
          tabs={header.tabs}
          activeTab={header.activeTab}
        />

        {children}

      </div>
    </div>
  );
}