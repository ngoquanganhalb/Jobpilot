"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAuth, setUser } from "@redux/slices/authSlice";
import { useGetUserProfile } from "@hooks/business/useGetUserProfile";

export default function FetchPermission() {
  const dispatch = useDispatch();
  const { data, isError } = useGetUserProfile();

  useEffect(() => {
    if (data) {
      dispatch(
        setUser({
          user: data.user,
          permissions: data?.permissions ?? [],
        })
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(clearAuth());
    }
  }, [isError, dispatch]);

  return null;
}
