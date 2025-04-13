'use client'
import { useEffect, useState } from "react";
import { firestore } from "../../services/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
// import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Header from "@component/components/Header";
import SearchBar from "@component/components/SearchBar";
export default function Jobs() {

  // type Job = {
  //   id: string;
  //   title: string;
  //   description: string;
  //   imageUrl?: string;
  //   createdAt: any;
  // }
    return (
      <div>
        <Header />
        <SearchBar />

        {/* {jobs.map((job) => (
          <div
            key={job.id}
            style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}
          >
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            {job.imageUrl && <img src={job.imageUrl} alt={job.title} width="200" />}
          </div>
        ))} */}
      </div>
    )
}



