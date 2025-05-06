import { OverviewChart } from "@modules/client/overview/components/OverviewChart";
import List from "./components/List";

export default function Overview() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col  gap-6">
          <div className="lg:w-2/3 w-full">
            <OverviewChart />
          </div>
          <List />
        </div>
      </div>
    </div>
  );
}
