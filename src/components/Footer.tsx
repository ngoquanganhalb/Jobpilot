export default function Footer() {
  return (
    <div className="bg-zinc-900 text-white">
      <div className="px-6 md:px-[100px] py-8 md:py-16 flex flex-col md:flex-row justify-between items-start">
        {/* Left Section */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex justify-start items-center gap-2">
            <div className="w-10 h-10 relative overflow-hidden">
              <div className="w-10 h-10 left-0 top-0 absolute" />
              <div className="w-7 h-6 left-[5px] top-[11.25px] absolute outline outline-[2.50px] outline-offset-[-1.25px] outline-white" />
              <div className="w-3 h-[5px] left-[13.75px] top-[6.25px] absolute outline outline-[2.50px] outline-offset-[-1.25px] outline-white" />
              <div className="w-7 h-1 left-[5px] top-[19.74px] absolute outline outline-[2.50px] outline-offset-[-1.25px] outline-white" />
              <div className="w-1 h-0 left-[18.12px] top-[18.75px] absolute outline outline-[2.50px] outline-offset-[-1.25px] outline-white" />
            </div>
            <div className="text-2xl font-semibold">Jobpilot</div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-lg">Call now:</div>
            <div className="text-xl font-medium">(319) 555-0115</div>
            <div className="w-80 text-sm text-gray-400">
              6391 Elgin St. Celina, Delaware 10299, New York, United States of
              America
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col gap-6">
          <div className="text-xl font-medium">Quick Link</div>
          <div className="flex flex-col gap-1">
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              About
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Contact
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Pricing
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Blog
            </div>
          </div>
        </div>

        {/* Candidate Section */}
        <div className="flex flex-col gap-6">
          <div className="text-xl font-medium">Candidate</div>
          <div className="flex flex-col gap-1">
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Browse Jobs
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Browse Employers
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Candidate Dashboard
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Saved Jobs
            </div>
          </div>
        </div>

        {/* Employers Section */}
        <div className="flex flex-col gap-6">
          <div className="text-xl font-medium">Employers</div>
          <div className="flex flex-col gap-1">
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Post a Job
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Browse Candidates
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Employers Dashboard
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Applications
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="flex flex-col gap-6">
          <div className="text-xl font-medium ">Support</div>
          <div className="flex flex-col gap-1">
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Faqs
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Privacy Policy
            </div>
            <div className="text-base text-gray-400 cursor-pointer hover:underline">
              Terms & Conditions
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="px-6 md:px-[100px] py-6 bg-zinc-900 text-sm text-gray-500 flex justify-between items-center">
        <div>@ 2025 Jobpilot - Job Portal. All rights Reserved</div>
      </div>
    </div>
  );
}
