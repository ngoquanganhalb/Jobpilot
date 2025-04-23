import LocationIcon from "@component/icons/LocationIcon";
import SearchIcon from "@component/icons/SearchIcon";
import Button from "@component/ui/ButtonCustom";
import Input from "@component/ui/InputCustom";
import { useDispatch } from "react-redux";
import {
  setKeyword as setKeywordRedux,
  setLocation as setLocationRedux,
} from "@redux/slices/searchSlice";
import { useState, useEffect } from "react";

export default function Filter() {
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setKeywordRedux(keyword));
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword, dispatch]);

  // Debounce location
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLocationRedux(location));
    }, 500);
    return () => clearTimeout(timer);
  }, [location, dispatch]);

  return (
    <div className="p-5 md:px-[150px]">
      <div className=" flex flex-col md:flex-row md:justify-between items-center gap-1 md:gap-0 2xl:max-h-[72px] border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-[80%]">
          <Input
            icon={<SearchIcon />}
            placeholder="Search by: Job title, Position, Keyword..."
            className="border-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Input
            icon={<LocationIcon />}
            placeholder="City, state or zip code"
            className="border-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
