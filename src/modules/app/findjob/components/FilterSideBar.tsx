"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  JobType,
  JOB_TYPE_OPTIONS,
  JOB_TAG_OPTIONS,
} from "../../../../types/db";
import { useForm } from "react-hook-form";
import { FaFilter } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { setFilters, resetFilters } from "@redux/slices/filterSlice";
import { FilterFormValues } from "@types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@component/ui/checkbox";
import { Slider } from "@component/ui/slider";
import { Badge } from "@component/ui/badge";
import { Button } from "@component/ui/Button";
import { Input } from "@component/ui/Input";
import { cn } from "@component/lib/utils";

export default function FilterSideBar() {
  const [tagSearch, setTagSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { watch, setValue, handleSubmit, reset } = useForm<FilterFormValues>({
    defaultValues: {
      location: "",
      tags: [],
      jobTypes: [],
      minSalary: 0,
      maxSalary: 200000,
      isRemote: false,
    },
  });

  const watchAll = watch();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFilters(watchAll)); // Automatically dispatch filters whenever any form value changes
  }, [watchAll, dispatch]);

  const onSubmit = (data: FilterFormValues) => {
    dispatch(setFilters(data));
    setIsSheetOpen(false);
  };
  const clearAllFilters = () => {
    reset();
    // setTagSearch("");
    dispatch(resetFilters());
  };

  const removeTag = (tag: string) => {
    console.log("Removing tag:", tag);
    const newTags = watchAll.tags.filter((t) => t !== tag);

    setValue("tags", newTags);
  };

  const toggleJobType = (type: JobType) => {
    const current = watchAll.jobTypes;
    if (current.includes(type)) {
      setValue(
        "jobTypes",
        current.filter((t) => t !== type)
      );
    } else {
      setValue("jobTypes", [...current, type]);
    }
  };

  const renderActiveFilters = () => {
    const filters = [];

    if (watchAll.location) {
      filters.push(
        <Badge
          key="location"
          variant="secondary"
          className="px-2 py-1 flex items-center gap-1"
        >
          Location: {watchAll.location}
          <div
            className="h-3 w-3 ml-1 cursor-pointer"
            onClick={() => setValue("location", "")}
          >
            X
          </div>
        </Badge>
      );
    }

    watchAll.tags.forEach((tag) => {
      filters.push(
        <Badge
          key={`tag-${tag}`}
          variant="secondary"
          className="px-2 py-1 flex items-center gap-1"
        >
          {tag}
          <div
            className="h-3 w-3 ml-1 cursor-pointer"
            onClick={() => removeTag(tag)}
          >
            X
          </div>
        </Badge>
      );
    });

    watchAll.jobTypes.forEach((type) => {
      filters.push(
        <Badge
          key={`type-${type}`}
          variant="secondary"
          className="px-2 py-1 flex items-center gap-1"
        >
          {type.replace("_", " ")}
          <div
            className="h-3 w-3 ml-1 cursor-pointer"
            onClick={() =>
              setValue(
                "jobTypes",
                watchAll.jobTypes.filter((t) => t !== type)
              )
            }
          >
            {" "}
            X
          </div>
        </Badge>
      );
    });

    if (watchAll.minSalary > 0 || watchAll.maxSalary < 200000) {
      filters.push(
        <Badge
          key="salary"
          variant="secondary"
          className="px-2 py-1 flex items-center gap-1"
        >
          Salary: ${watchAll.minSalary.toLocaleString()} - $
          {watchAll.maxSalary.toLocaleString()}
          <div
            className="h-3 w-3 ml-1 cursor-pointer"
            onClick={() => {
              setValue("minSalary", 0);
              setValue("maxSalary", 200000);
            }}
          >
            {" "}
            X{" "}
          </div>
        </Badge>
      );
    }

    if (watchAll.isRemote) {
      filters.push(
        <Badge
          key="remote"
          variant="secondary"
          className="px-2 py-1 flex items-center gap-1"
        >
          Remote Only
          <div
            className="h-3 w-3 ml-1 cursor-pointer"
            onClick={() => setValue("isRemote", false)}
          >
            X
          </div>
        </Badge>
      );
    }

    return filters;
  };
  const isFiltering = () => {
    return (
      watchAll.location !== "" ||
      watchAll.tags.length > 0 ||
      watchAll.jobTypes.length > 0 ||
      watchAll.minSalary > 0 ||
      watchAll.maxSalary < 200000 ||
      watchAll.isRemote === true
    );
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        {isFiltering() ? (
          <Button className="text-lg font-semibold py-6 border border-blue-100 bg-[#0A65CC] text-white hover:bg-blue-500 rounded-md flex items-center w-full">
            <FaFilter />
            Filter
            <GoDotFill className="text-red-500 text-4xl" />
          </Button>
        ) : (
          <Button className="text-lg font-semibold py-6 border border-blue-100 bg-[#0A65CC] text-white hover:bg-blue-500 rounded-md flex items-center w-full cursor-pointer">
            <FaFilter />
            Filter
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="left" className="w-[350px]">
        <SheetTitle></SheetTitle>
        <div className="w-full bg-white border-r p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            {renderActiveFilters().length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>

          {renderActiveFilters().length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {renderActiveFilters()}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Accordion
              type="multiple"
              defaultValue={["location", "jobTags", "jobTypes", "salary"]}
            >
              <AccordionItem value="jobTags">
                <AccordionTrigger className="py-2">
                  Job Categories
                </AccordionTrigger>
                <AccordionContent className="p-2">
                  <Input
                    placeholder="Search categories"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="mb-2"
                  />
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {JOB_TAG_OPTIONS.filter((tag) =>
                      tag.toLowerCase().includes(tagSearch.toLowerCase())
                    ).map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center space-x-2 py-1 px-1 hover:bg-gray-50 rounded"
                      >
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={watchAll.tags.includes(tag)}
                          onCheckedChange={() => {
                            const current = watchAll.tags;
                            if (current.includes(tag)) {
                              setValue(
                                "tags",
                                current.filter((t) => t !== tag)
                              );
                            } else {
                              setValue("tags", [...current, tag]);
                            }
                          }}
                        />
                        <label
                          htmlFor={`tag-${tag}`}
                          className={cn("text-sm flex-grow cursor-pointer", {
                            "font-medium": watchAll.tags.includes(tag),
                          })}
                        >
                          {tag}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="jobTypes">
                <AccordionTrigger className="py-2">Job Type</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {JOB_TYPE_OPTIONS.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={watchAll.jobTypes.includes(type)}
                          onCheckedChange={() => toggleJobType(type)}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm cursor-pointer"
                        >
                          {type.replace("_", " ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="salary">
                <AccordionTrigger className="py-2">
                  Salary Range
                </AccordionTrigger>
                <AccordionContent className="p-2">
                  <div className="space-y-4 px-1">
                    <Slider
                      min={0}
                      max={200000}
                      step={5000}
                      value={[watchAll.minSalary, watchAll.maxSalary]}
                      onValueChange={([min, max]) => {
                        setValue("minSalary", min);
                        setValue("maxSalary", max);
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>${watchAll.minSalary.toLocaleString()}</span>
                      <span>${watchAll.maxSalary.toLocaleString()}</span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Input
                        type="number"
                        value={watchAll.minSalary}
                        onChange={(e) =>
                          setValue("minSalary", Number(e.target.value))
                        }
                        placeholder="Min"
                        className="w-1/2"
                      />
                      <Input
                        type="number"
                        value={watchAll.maxSalary}
                        onChange={(e) =>
                          setValue("maxSalary", Number(e.target.value))
                        }
                        placeholder="Max"
                        className="w-1/2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue("minSalary", 0);
                          setValue("maxSalary", 50000);
                        }}
                      >
                        $0 - $50K
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue("minSalary", 50000);
                          setValue("maxSalary", 100000);
                        }}
                      >
                        $50K - $100K
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue("minSalary", 100000);
                          setValue("maxSalary", 150000);
                        }}
                      >
                        $100K - $150K
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue("minSalary", 150000);
                          setValue("maxSalary", 200000);
                        }}
                      >
                        $150K+
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                id="remote"
                checked={watchAll.isRemote}
                onCheckedChange={(checked) => setValue("isRemote", !!checked)}
              />
              <label htmlFor="remote" className="text-sm">
                Remote Jobs Only
              </label>
            </div>

            <Button type="submit" className="w-full mt-4 cursor-pointer">
              Apply Filters
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
