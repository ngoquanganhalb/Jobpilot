import React from "react";
import { useFetchJobBox } from "@hooks/useFetchJobBox";
import Filter from "./components/Filter";
import List from "./components/List";

export default function FindJobModule() {
  const { jobs } = useFetchJobBox();
  return (
    <>
      <Filter />
      <List values={jobs} />
    </>
  );
}
