"use client";

import React, { useEffect, useMemo, useState } from "react";
import List from "@modules/app/findjob/components/List";
import { Job } from "../../../types/db";
import { useGetSuggestJob } from "@hooks/cv/useGetSuggestJob";
import Spinner from "@component/ui/Spinner";
import { useGetUserCv } from "@hooks/cv/useGetUserCv";
import { PermissionGate } from "@/permission/PermissionGate";
import { PERMISSIONS } from "@/permission/Permission.const";
type SuggesJobResponse = {
  job: Job;
  similarity: number;
}[];
const SuggestJobPage: React.FC = () => {
  // make payload stable so effect deps are predictable
  const { data: cv = [], isLoading } = useGetUserCv();
  const cvActive = cv?.filter((i) => i.isActive === true)[0];
  const payload = useMemo(
    () => ({ cv_id: cvActive?.id, limit: 10000 }),
    [cvActive?.id]
  );
  const { getSuggestJobMutation } = useGetSuggestJob();

  const [jobs, setJobs] = useState<SuggesJobResponse>([]);
  const jobsList = jobs.map((i) => i.job);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        if (isLoading) return;

        // call mutation inside effect (not in render)
        const res = await getSuggestJobMutation(payload);

        // handle response shape: Job[] or { data: Job[] }
        const resultJobs: SuggesJobResponse = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        if (!mounted) return;
        setJobs(resultJobs);
      } catch (e) {
        console.error("Suggest job error:", e);
        if (!mounted) return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [payload, isLoading]);

  if (loading) return <Spinner />;
  if (!jobs.length)
    return (
      <p className="text-gray-500 text-lg font-semibold flex items-center justify-center">
        No Job Found
      </p>
    );

  return <List values={jobsList} />;
};

const SuggestJob: React.FC = () => {
  return (
    <PermissionGate scopes={[PERMISSIONS.CV.FIND_SIMILAR_JOB]}>
      <SuggestJobPage />
    </PermissionGate>
  );
};
SuggestJob.displayName = "SuggestJob";

export default SuggestJob;
