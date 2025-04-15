import LocationIcon from "@component/components/icons/LocationIcon";
import SearchIcon from "@component/components/icons/SearchIcon";
import Button from "@component/components/ui/Button";
import Input from "@component/components/ui/Input";

export default function Filter() {
  return (
    <div className="p-5 md:px-[150px]">
      <div className=" flex flex-col md:flex-row md:justify-between items-center gap-1 md:gap-0 2xl:max-h-[72px] border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-[80%]">
          <Input
            icon={<SearchIcon />}
            placeholder="Search by: Job title, Position, Keyword..."
            className="border-none"
          />
          <Input
            icon={<LocationIcon />}
            placeholder="City, state or zip code"
            className="border-none"
          />
        </div>
        <div className="flex flex-row justify-center gap-1 md:gap-4 w-full md:w-[20%] py-5 px-1">
          <Button variant="secondary" className="border border-gray-300">
            Filter
          </Button>
          <Button className="border border-gray-300">Find Job</Button>
        </div>
      </div>
    </div>
  );
}
