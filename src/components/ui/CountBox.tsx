import { CountBoxProps } from "@types";

export default function CountBox({
  count,
  title,
  img,
  className = "",
}: CountBoxProps) {
  return (
    <button
      className={`cursor-pointer hover:scale-110 transition-transform duration-200  ${className}`}
    >
      <div className="flex gap-5 p-5 rounded-[8px] bg-white hover:bg-gray-300 mx-5 md:mx-0 ">
        <div
          className="rounded-[3px]
        flex items-center
        text-[16px]
        font-semibold
        leading-[24px]
        px-[16px]
        py-[16px]
        bg-blue-50
      
        
       "
        >
          {" "}
          {img}{" "}
        </div>

        <div className="flex flex-col justify-center items-start">
          <div className="text-gray-900 text-[24px] leading-6 font-medium ">
            {count}
          </div>
          <div className="text-gray-500 text-[16px] leading-6 font-normal">
            {title}
          </div>
        </div>
      </div>
    </button>
  );
}
