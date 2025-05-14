"use client";
import { useRouter } from "next/navigation";
import CandidateIcon from "@component/icons/CandidateIcon";
import CompanyIcon from "@component/icons/CompanyIcon";
import JobIcon from "@component/icons/JobIcon";
import Line from "@component/icons/Line";
import LocationIcon from "@component/icons/LocationIcon";
import SearchIcon from "@component/icons/SearchIcon";
import Button from "@component/ui/ButtonCustom";
import CountBox from "@component/ui/CountBox";
import Input from "@component/ui/InputCustom";
import { db } from "@services/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useDebounce from "@hooks/useDebounce";
import {
  setKeyword as setKeywordRedux,
  setLocation as setLocationRedux,
} from "@redux/slices/searchSlice";

export default function Banner() {
  const [jobCount, setJobCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedLocation = useDebounce(location, 500);

  const router = useRouter();

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    const trimmedLocation = location.trim();

    dispatch(setKeywordRedux(trimmedKeyword));
    dispatch(setLocationRedux(trimmedLocation));

    const query = new URLSearchParams();
    if (trimmedKeyword) query.append("keyword", trimmedKeyword);
    if (trimmedLocation) query.append("location", trimmedLocation);

    router.push(`/find-job?${query.toString()}`);
  };

  //debounce search
  useEffect(() => {
    dispatch(setKeywordRedux(debouncedKeyword));
  }, [debouncedKeyword, dispatch]);

  useEffect(() => {
    dispatch(setLocationRedux(debouncedLocation));
  }, [debouncedLocation, dispatch]);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // fetch jobs quantity
        const jobsQuery = query(
          collection(db, "jobs"),
          where("status", "==", "Active")
        );
        const jobsSnapshot = await getDocs(jobsQuery);
        setJobCount(jobsSnapshot.size);

        const usersSnapshot = await getDocs(collection(db, "users"));

        let candidates = 0;
        let companies = 0;

        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.accountType === "candidate") candidates++;
          if (data.accountType === "employer") companies++;
        });

        setCandidateCount(candidates);
        setCompanyCount(companies);
      } catch (error) {
        console.error("Error fetching counts from Firestore:", error);
      }
    }

    fetchCounts();
  }, []);
  return (
    <div className="flex flex-col gap-[30px] bg-[rgba(241,242,244,0.6)] md:px-[100px] md:py-[80px] lg:px-[150px] lg:py-[100px] ">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-0">
        <div className="flex flex-col w-full lg:w-[60%]">
          <div className="font-normal mx-3 md:mx-0 text-[36px] md:text-[48px] lg:text-[56px] text-gray-900 leading-[48px] md:leading-[56px] lg:leading-[64px] animate-in fade-in slide-in-from-left-100 duration-1000">
            Find a job that suits your interest & skills.
          </div>
          <div className="w-full mx-3 md:mx-0 md:w-[80%] text-[14px] md:text-[18px] text-gray-600 font-normal leading-[24px] md:leading-[28px] mt-6 animate-in fade-in slide-in-from-left-100 duration-2000">
            Aliquam vitae turpis in diam convallis finibus in at risus. Nullam
            in scelerisque leo, eget sollicitudin velit bestibulum.
          </div>
          {/* search */}
          <div className="mt-8 hidden md:flex flex-col md:flex-row bg-white border border-gray-100 rounded-[8px] p-4 gap-4">
            <div className="flex flex-1 flex-col sm:flex-row gap-4">
              <div className="flex flex-1 items-center gap-3">
                <Input
                  icon={<SearchIcon />}
                  placeholder="Job title, Keyword..."
                  className="flex-1 border-none"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <Line className="hidden sm:block" />
                <Input
                  icon={<LocationIcon />}
                  placeholder="Your Location"
                  className="flex-1 border-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button className="w-full md:w-auto" onClick={handleSearch}>
                Find Job
              </Button>
            </div>
          </div>
        </div>
        <div className="flex w-full lg:w-[40%] items-center justify-center">
          <Image
            className="bounce-20px"
            src="/images/BannerHome.png"
            alt="Banner-Header "
            width={1200}
            height={400}
          />
          ;
        </div>
      </div>
      {/* info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 animate-in fade-in zoom-in duration-3000">
        <CountBox
          count={jobCount}
          title="Jobs"
          img={<JobIcon />}
          className="w-full sm:w-[300px] md:w-[400px] "
        />
        <CountBox
          count={companyCount}
          title="Companies"
          img={<CompanyIcon />}
          className="w-full sm:w-[300px] md:w-[400px]"
        />
        <CountBox
          count={candidateCount}
          title="Candidates"
          img={<CandidateIcon />}
          className="w-full sm:w-[300px] md:w-[400px]"
        />
      </div>
    </div>
  );
}
