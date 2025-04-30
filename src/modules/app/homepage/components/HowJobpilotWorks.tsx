export const HowJobpilotWork = () => {
  return (
    <div className=" py-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          How Jobpilot work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            {/* Replace with your icon */}
            <div className="mx-auto bg-indigo-100 text-indigo-500 rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-2a7 7 0 10-14 0 7 7 0 0014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Search millions of jobs
            </h3>
            <p className="text-gray-600">
              Explore a vast database of job postings from various companies and
              industries.
            </p>
          </div>
          <div className="text-center">
            {/* Replace with your icon */}
            <div className="mx-auto bg-blue-100 text-blue-500 rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-1.177 8-5.042 8-3.868 0-7.659-3.943-8.933-8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Save & manage jobs
            </h3>
            <p className="text-gray-600">
              Keep track of your favorite job openings and manage your
              applications efficiently.
            </p>
          </div>
          <div className="text-center">
            {/* Replace with your icon */}
            <div className="mx-auto bg-green-100 text-green-500 rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Get matched with top companies
            </h3>
            <p className="text-gray-600">
              Connect with leading companies that are actively hiring for roles
              that match your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
