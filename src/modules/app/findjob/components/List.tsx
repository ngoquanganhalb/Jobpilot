"use client";
import JobBox from "@component/ui/JobBox";
import { useEffect, useState } from "react";
import StepPagination from "@component/ui/StepPagination";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { resetFilters, setFilters } from "@redux/slices/filterSlice";
import { useSearchParams } from "next/navigation";
import Spinner from "@component/ui/Spinner";
import {
  setKeyword as setKeywordRedux,
  setLocation as setLocationRedux,
} from "@redux/slices/searchSlice";
import { usePagination } from "@hooks/common-hooks/usePagination";
import { useFilterJobs } from "@hooks/common-hooks/useFilterJobs";
import { Job } from "../../../../types/db";

type Props = {
  values: Job[];
};

export default function List({ values: jobs }: Props) {
  const keyword = useSelector((state: RootState) => state.search.keyword);
  const location = useSelector((state: RootState) => state.search.location);
  const filter = useSelector((state: RootState) => state.filter);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  // const [isMounted, setIsMounted] = useState(false);

  // // 1. Chỉ giữ lại isMounted để tránh Hydration Error
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // 2. GỘP TOÀN BỘ LOGIC SYNC URL -> REDUX VÀO ĐÂY
  useEffect(() => {
    // if (!isMounted) return;

    // Lấy params trực tiếp
    const tag = searchParams.get("tag");
    const kw = searchParams.get("keyword") || "";
    const loc = searchParams.get("location") || "";

    // Sync Search Keyword & Location
    dispatch(setKeywordRedux(kw));
    dispatch(setLocationRedux(loc));

    // Sync Filter Tag: Logic quan trọng để fix lỗi reset
    if (tag) {
      // Nếu URL CÓ tag: Force set filter theo tag đó ngay lập tức
      dispatch(
        setFilters({
          tags: [tag],
        })
      );
    } else {
      // Nếu URL KHÔNG CÓ tag: Lúc này mới được phép Reset
      // Điều này thay thế hoàn toàn cho cái useEffect resetFilters chạy lúc mount
      dispatch(resetFilters());
    }
  }, [searchParams, dispatch]);
  // Dependency là searchParams: Bất cứ khi nào URL đổi, Redux sẽ cập nhật theo đúng trạng thái URL

  const filteredJobs = useFilterJobs({ jobs, keyword, location, filter });

  const {
    page,
    totalPages,
    pageItems: currentJobs,
    next,
    prev,
    setPage,
  } = usePagination(filteredJobs, 12);

  // if (!isMounted) {
  //   return <Spinner />;
  // }

  return (
    <div className="flex flex-col gap-[50px] md:px-[100px] md:py-[50px] lg:px-[150px] ">
      <div className="flex items-center justify-center min-h-[200px]">
        {currentJobs.length === 0 ? (
          <p className="text-gray-500 text-lg font-semibold">No Job Found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 justify-items-center">
            {currentJobs.map((job) => (
              <JobBox
                key={job.jobId}
                id={job.jobId}
                company={job.companyName || "Unknown Company"}
                location={job.location?.province || "Unknown Location"}
                title={job.jobTitle || "Unknown Title"}
                type={job.jobType?.toUpperCase() || "FULL-TIME"}
                salary={
                  job.minSalary && job.maxSalary
                    ? `$${job.minSalary} - $${job.maxSalary}`
                    : "Negotiate"
                }
                urgent={job.isRemote}
                logo={job.avatarCompany}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <StepPagination
          currentStep={page}
          totalSteps={totalPages}
          onNext={next}
          onPrevious={prev}
          onStepClick={setPage}
        />
      </div>
    </div>
  );
}
