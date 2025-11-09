import { Sidebar } from "@/components/dashboard/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-screen flex">
        {/* Sidebar */}
        <Sidebar />
        <div className="bg-[#F0F0F0] w-full">{children}</div>
      </div>
    </>
  );
};

export default layout;
