// "use client";

// import { useEffect, useState } from "react";
// import { Input } from "@component/ui/Input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// type Province = {
//   name: string;
//   code: number;
//   districts: {
//     name: string;
//     code: number;
//   }[];
// };

// type LocationSelectorProps = {
//   value: {
//     province: string;
//     district: string;
//     address: string;
//   };
//   onChange: (value: LocationSelectorProps["value"]) => void;
//   provinces: Province[];
// };

// export default function LocationSelector({
//   value,
//   onChange,
//   provinces,
// }: LocationSelectorProps) {
//   const [province, setProvince] = useState(value.province || "");
//   const [district, setDistrict] = useState(value.district || "");
//   const [address, setAddress] = useState(value.address || "");

//   const selectedProvince = provinces.find((p) => p.name === province);
//   const districts = selectedProvince?.districts || [];

//   useEffect(() => {
//     if (!districts.find((d) => d.name === district)) {
//       setDistrict("");
//     }
//   }, [province]);

//   useEffect(() => {
//     onChange({ province, district, address });
//   }, [province, district, address]);

//   return (
//     <div className="flex flex-row space-x-6">
//       {/* Province */}
//       <div className="">
//         <label className="text-sm font-medium text-gray-700 mb-1 block">
//           Province
//         </label>
//         <Select value={province} onValueChange={setProvince}>
//           <SelectTrigger className="cursor-pointer">
//             <SelectValue placeholder="Select province" />
//           </SelectTrigger>
//           <SelectContent>
//             {provinces.map((prov) => (
//               <SelectItem key={prov.code} value={prov.name}>
//                 {prov.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* District */}
//       <div className="">
//         <label className="text-sm font-medium text-gray-700 mb-1 block">
//           District
//         </label>
//         <Select
//           value={district}
//           onValueChange={setDistrict}
//           disabled={!province}
//         >
//           <SelectTrigger className="cursor-pointer">
//             <SelectValue placeholder="Select district" />
//           </SelectTrigger>
//           <SelectContent>
//             {districts.map((d) => (
//               <SelectItem key={d.code} value={d.name}>
//                 {d.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Address */}
//       <div className="w-full">
//         <label className="text-sm font-medium text-gray-700 mb-1 block">
//           Address
//         </label>
//         <Input
//           placeholder="Enter address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Input } from "@component/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@component/lib/utils";

type Province = {
  name: string;
  code: number;
  districts: {
    name: string;
    code: number;
  }[];
};

type LocationSelectorProps = {
  value: {
    province: string;
    district: string;
    address: string;
  };
  onChange: (value: LocationSelectorProps["value"]) => void;
  provinces: Province[];
  errors?: {
    province?: string;
    district?: string;
    address?: string;
  };
};

export default function LocationSelector({
  value,
  onChange,
  provinces,
  errors,
}: LocationSelectorProps) {
  const [province, setProvince] = useState(value.province || "");
  const [district, setDistrict] = useState(value.district || "");
  const [address, setAddress] = useState(value.address || "");

  const selectedProvince = provinces.find((p) => p.name === province);
  const districts = selectedProvince?.districts || [];

  useEffect(() => {
    // only call onChange if new value diff to previous value
    if (
      value.province !== province ||
      value.district !== district ||
      value.address !== address
    ) {
      onChange({ province, district, address });
    }
  }, [province, district, address]);

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-1">
      {/* Province */}
      <div className="w-full md:w-1/3">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Province
        </label>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger
            className={cn(
              "cursor-pointer",
              errors?.province ? "border-red-500" : ""
            )}
          >
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((prov) => (
              <SelectItem key={prov.code} value={prov.name}>
                {prov.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.province && (
          <p className="text-red-500 text-xs mt-1">{errors.province}</p>
        )}
      </div>

      {/* District */}
      <div className="w-full md:w-1/3">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          District
        </label>
        <Select
          value={district}
          onValueChange={setDistrict}
          disabled={!province}
        >
          <SelectTrigger
            className={cn(
              "cursor-pointer",
              errors?.district ? "border-red-500" : ""
            )}
          >
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((d) => (
              <SelectItem key={d.code} value={d.name}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.district && (
          <p className="text-red-500 text-xs mt-1">{errors.district}</p>
        )}
      </div>

      {/* Address */}
      <div className="w-full ">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Address
        </label>
        <Input
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={cn(errors?.address ? "border-red-500" : "")}
        />
        {errors?.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>
    </div>
  );
}
