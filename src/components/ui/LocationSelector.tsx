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
};

export default function LocationSelector({
  value,
  onChange,
  provinces,
}: LocationSelectorProps) {
  const [province, setProvince] = useState(value.province || "");
  const [district, setDistrict] = useState(value.district || "");
  const [address, setAddress] = useState(value.address || "");

  const selectedProvince = provinces.find((p) => p.name === province);
  const districts = selectedProvince?.districts || [];

  useEffect(() => {
    if (!districts.find((d) => d.name === district)) {
      setDistrict("");
    }
  }, [province]);

  useEffect(() => {
    onChange({ province, district, address });
  }, [province, district, address]);

  return (
    <div className="flex flex-row space-x-6">
      {/* Province */}
      <div className="">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Province
        </label>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="cursor-pointer">
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
      </div>

      {/* District */}
      <div className="">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          District
        </label>
        <Select
          value={district}
          onValueChange={setDistrict}
          disabled={!province}
        >
          <SelectTrigger className="cursor-pointer">
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
      </div>

      {/* Address */}
      <div className="w-full">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Address
        </label>
        <Input
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
    </div>
  );
}
