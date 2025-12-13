"use client";
import { UseCheckout } from "@hooks/payment/useCheckout";
import { RootState } from "@redux/store";
import { useParams } from "next/navigation";
import React, { JSX, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Tailwind + TypeScript React component for Next.js
// Save as: components/Pricing.tsx and import into a page (e.g. pages/index.tsx)

export default function Pricing(): JSX.Element {
  const params = useParams();
  const jobId = params.jobId as string;
  const [activePlan, setActivePlan] = useState<
    "basic" | "standard" | "premium"
  >("standard");
  const { mutateAsync: mutateAsyncCheckout } = UseCheckout();

  const getCardClass = (key: "basic" | "standard" | "premium") => {
    const isActive = activePlan === key;
    return `border rounded-lg shadow-sm bg-white overflow-hidden flex flex-col transition-all duration-300 cursor-pointer
      ${isActive ? "border-blue-500 -translate-y-4 shadow-lg ring-2 ring-blue-200" : "hover:-translate-y-2 hover:shadow-md"}`;
  };
  const user = useSelector((state: RootState) => state.auth.user);
  const handleCheckout = async () => {
    const data = await mutateAsyncCheckout({
      amount: 19,
      customerId: user?.id ?? 0,
      orderId: jobId,
      customerName: user?.name,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/find-job/${jobId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/post-job`,
    });
    console.log("data", data?.checkoutUrl);
    if (data?.checkoutUrl) {
      window.location.href = data?.checkoutUrl;
    } else {
      toast.error("Không tìm thấy checkoutUrl trong response");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            Buy Premium Subscription to Post a Job
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Donec eu dui ut dolor commodo ornare. Sed arcu libero, malesuada
            quis justo sit amet, varius tempus neque. Quisque ultrices mi sed
            lorem condimentum, vel tempus lectus ultricies.
          </p>
        </div>

        <div className="flex justify-end">
          <div className="w-56 h-56 bg-blue-50 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-40 h-40 opacity-90">
              <g fill="#1e3a8a">
                <circle cx="50" cy="50" r="48" fill="#f0f6ff" />
                <path
                  d="M30 70c5-12 20-12 25 0"
                  stroke="#234"
                  strokeWidth="2"
                  fill="none"
                />
                <rect
                  x="32"
                  y="25"
                  width="36"
                  height="18"
                  rx="3"
                  fill="#e6eefc"
                />
                <circle cx="44" cy="34" r="3" fill="#3b82f6" />
                <rect
                  x="52"
                  y="32"
                  width="10"
                  height="4"
                  rx="1"
                  fill="#3b82f6"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Basic */}
        <article
          onClick={() => setActivePlan("basic")}
          className={getCardClass("basic")}
        >
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">
              Basic
            </h3>
            <p className="text-gray-500 mt-2">
              Praesent eget pulvinar orci. Duis ut pellentesque ligula
              convallis.
            </p>
            <div className="mt-6">
              <div className="text-3xl font-bold text-blue-600">
                $19
                <span className="text-base font-normal text-gray-400">
                  /Monthly
                </span>
              </div>
            </div>
          </div>

          <div className="border-t p-6 grow">
            <ul className="space-y-3 text-gray-600">
              {[
                "Post 1 Job",
                // "Urgents & Featured Jobs",
                // "Highlights Job with Colors",
                // "Access & Saved 5 Candidates",
                "10 Days Resume Visibility",
                "24/7 Critical Support",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-1 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 border-t bg-white">
            <button
              onClick={handleCheckout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-md font-medium hover:bg-blue-100"
            >
              Choose Plan
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </article>

        {/* Standard */}
        <article
          onClick={() => setActivePlan("standard")}
          className={getCardClass("standard")}
        >
          <div className="absolute left-1/2 -translate-x-1/2">
            {activePlan === "standard" && (
              <div className="bg-blue-600 text-white px-1 py-1 text-sm">
                Recommendation
              </div>
            )}
          </div>
          <div className="px-6 py-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">
              Standard
            </h3>
            <p className="text-gray-500 mt-2">
              Praesent eget pulvinar orci. Duis ut pellentesque ligula
              convallis.
            </p>
            <div className="mt-6">
              <div className="text-3xl font-bold text-blue-600">
                $39
                <span className="text-base font-normal text-gray-400">
                  /Monthly
                </span>
              </div>
            </div>
          </div>

          <div className="border-t p-6 grow">
            <ul className="space-y-3 text-gray-600">
              {[
                "3 Active Jobs",
                "Urgents & Featured Jobs",
                "Highlights Job with Colors",
                "Access & Saved 10 Candidates",
                "20 Days Resume Visibility",
                "24/7 Critical Support",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-1 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 border-t bg-white">
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-md font-medium hover:bg-blue-100">
              Not supported yet
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </article>

        {/* Premium */}
        <article
          onClick={() => setActivePlan("premium")}
          className={getCardClass("premium")}
        >
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">
              Premium
            </h3>
            <p className="text-gray-500 mt-2">
              Praesent eget pulvinar orci. Duis ut pellentesque ligula
              convallis.
            </p>
            <div className="mt-6">
              <div className="text-3xl font-bold text-blue-600">
                $59
                <span className="text-base font-normal text-gray-400">
                  /Monthly
                </span>
              </div>
            </div>
          </div>

          <div className="border-t p-6 grow">
            <ul className="space-y-3 text-gray-600">
              {[
                "6 Active Jobs",
                "Urgents & Featured Jobs",
                "Highlights Job with Colors",
                "Access & Saved 20 Candidates",
                "30 Days Resume Visibility",
                "24/7 Critical Support",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-1 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 border-t bg-white">
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-md font-medium hover:bg-blue-100">
              Not supported yet
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
