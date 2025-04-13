import BannerHeader from "@component/components/icons/BannerHeaderImg";
import JobIcon from "@component/components/icons/JobIcon";
import Line from "@component/components/icons/Line";
import LocationIcon from "@component/components/icons/LocationIcon";
import SearchIcon from "@component/components/icons/SearchIcon";
import Button from "@component/components/ui/Button";
import CountBox from "@component/components/ui/CountBox";
import Input from "@component/components/ui/Input";

export default function Banner() {
  return (
    <div className="flex flex-col gap-[30px] bg-[rgba(241,242,244,0.6)]  md:px-[100px] md:py-[80px] lg:px-[150px] lg:py-[100px]">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-0">
        <div className="flex flex-col w-full lg:w-[60%]">
          <div className="font-normal text-[36px] md:text-[48px] lg:text-[56px] text-gray-900 leading-[48px] md:leading-[56px] lg:leading-[64px]">
            Find a job that suits your interest & skills.
          </div>
          <div className="w-full md:w-[80%] text-[14px] md:text-[18px] text-gray-600 font-normal leading-[24px] md:leading-[28px] mt-6">
            Aliquam vitae turpis in diam convallis finibus in at risus. Nullam
            in scelerisque leo, eget sollicitudin velit bestibulum.
          </div>
          {/* search */}
          <div className="flex mt-8 flex-col md:flex-row bg-white border border-gray-100 rounded-[8px] p-3 gap-4 md:gap-3">
            <div className="flex flex-row items-center gap-3 w-full md:w-auto">
              <Input
                icon={<SearchIcon />}
                placeholder="Job tittle, Keyword..."
                className="h-[100%] flex-1 border-none"
              />
              <Line />

              <Input
                icon={<LocationIcon />}
                placeholder="Your Location"
                className="h-[100%] flex-1 border-none"
              />
            </div>
            <Button className="w-full md:w-auto ml-auto mt-4 md:mt-0">
              Find Job
            </Button>
          </div>
        </div>
        <div className="flex w-full lg:w-[40%] items-center justify-center">
          <BannerHeader />
        </div>
      </div>
      {/* info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 ">
        <CountBox
          count={1000}
          title="Jobs"
          img={<JobIcon />}
          className="w-full sm:w-[300px] md:w-[400px]"
        />
        <CountBox
          count={1000}
          title="Jobs"
          img={<JobIcon />}
          className="w-full sm:w-[300px] md:w-[400px]"
        />
        <CountBox
          count={1000}
          title="Jobs"
          img={<JobIcon />}
          className="w-full sm:w-[300px] md:w-[400px]"
        />
      </div>
    </div>
  );
}
