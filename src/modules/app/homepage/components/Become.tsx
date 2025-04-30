import Paths from "@/constants/paths";
import ArrowIcon from "@component/icons/ArrowIcon";
import Button from "@component/ui/ButtonCustom";
import Link from "next/link";

export const Become = () => {
  return (
    <div className="flex flex-row py-10 bg-gray-100">
      <div className="flex-1 flex justify-end pr-10">
        <div
          className="flex flex-col md:flex-row items-center justify-between bg-cover bg-center rounded-xl p-6 md:p-10 shadow-md"
          style={{ backgroundImage: "url('/images/BecomeACandidate.jpg')" }}
        >
          {/* Text Content */}
          <div className="relative max-w-md text-center md:text-left w-2/3">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Become a Candidate
            </h2>
            <p className="text-gray-500 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <Link href={Paths.SIGN_IN}>
              <Button variant="secondary">
                {" "}
                Register Now <ArrowIcon className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-start pl-10">
        <div
          className="flex flex-col md:flex-row items-center justify-between bg-cover bg-center rounded-xl p-6 md:p-10 shadow-md"
          style={{
            backgroundImage: "url('/images/BecomeAEmployer.jpg')",
            backgroundPosition: "0px -64px ",
          }}
        >
          {/* Text Content */}
          <div className="relative max-w-md text-center md:text-left w-2/3">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Become an Employer
            </h2>
            <p className="text-gray-500 mb-6 ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            {/* <button className="bg-white text-blue-600 font-semibold border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 flex items-center gap-2 transition">
              Register Now
              <span className="text-lg">→</span>
            </button> */}
            <Link href={Paths.SIGN_IN}>
              <Button variant="secondary">
                {" "}
                Register Now <ArrowIcon className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
