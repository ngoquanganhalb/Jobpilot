import Paths from "@/constants/paths";
import ArrowIcon from "@component/icons/ArrowIcon";
import Button from "@component/ui/ButtonCustom";
import Link from "next/link";

export const Become = () => {
  return (
    <div className="flex flex-col md:flex-row py-10 bg-gray-100 space-y-6 md:space-y-0 md:space-x-20 px-4 md:px-10">
      {/* Candidate */}
      <div className="flex-1 flex justify-center md:justify-end">
        <div
          className="flex flex-col items-center md:items-start justify-between bg-cover bg-center rounded-xl p-6 md:p-10 shadow-md w-full max-w-md"
          style={{ backgroundImage: "url('/images/BecomeACandidate.jpg')" }}
        >
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Become a Candidate
            </h2>
            <p className="text-gray-500 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <Link href={Paths.SIGN_IN}>
              <Button variant="secondary">
                Register Now <ArrowIcon className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Employer */}
      <div className="flex-1 flex justify-center md:justify-start">
        <div
          className="flex flex-col items-center md:items-start justify-between bg-cover bg-center rounded-xl p-6 md:p-10 shadow-md w-full max-w-md"
          style={{
            backgroundImage: "url('/images/BecomeAEmployer.jpg')",
            backgroundPosition: "0px -64px",
          }}
        >
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Become an Employer
            </h2>
            <p className="text-gray-500 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <Link href={Paths.SIGN_IN}>
              <Button variant="secondary">
                Register Now <ArrowIcon className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
