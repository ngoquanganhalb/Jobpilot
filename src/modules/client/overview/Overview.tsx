import { OverviewChart } from "@modules/client/overview/components/OverviewChart";
import List from "./components/List";

export default function Overview() {
  return (
    <div className="p-4 md:p-6 ">
      <div className="bg-white rounded-2xl p-6 space-y-8 flex flex-col shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)] ">
        <div className="w-full shadow-xl md:w-1/2 rounded-2xl">
          <OverviewChart />
        </div>
        <div className="w-full">
          <List />
        </div>
      </div>
    </div>
  );
}
