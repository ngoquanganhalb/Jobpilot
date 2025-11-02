"use client";

import { useGetUserProfile } from "@hooks/business/useGetUserProfile";

export default function Page() {
  const { data, isLoading, isError } = useGetUserProfile();

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      <div>hello</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
