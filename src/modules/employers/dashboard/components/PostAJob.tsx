// "use client";
// import provinces from "../../../../constants/data/location.json";
// import { useState } from "react";
// import { Input } from "@/components/ui/Input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/Button";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { collection, Timestamp, getDoc, doc, setDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "@services/firebase/firebase";
// import { toast } from "react-toastify";
// import { Upload } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { format, isToday, isBefore } from "date-fns";
// import { FaCalendarAlt } from "react-icons/fa";
// import { cn } from "@component/lib/utils";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import Image from "next/image";
// import { toBase64 } from "@lib/convertBase64";
// import { Job, JobType, JOB_TAG_OPTIONS } from "../../../../types/db";
// import { useRouter } from "next/navigation";
// import LocationSelector from "@component/ui/LocationSelector";
// import { z } from "zod";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// // Define schema with zod
// const jobFormSchema = z.object({
//   jobTitle: z.string().min(1, "Job title is required"),
//   jobType: z.string().default("full-time"),
//   tags: z.array(z.string()).min(1, "At least one tag is required"),
//   minSalary: z.number().min(0, "Min salary must be 0 or greater"),
//   maxSalary: z.number().min(0, "Max salary must be 0 or greater").refine(
//     (data) => true, // This will be validated in the form with custom logic
//     { message: "Max salary must be greater than min salary" }
//   ),
//   description: z.string().min(1, "Description is required"),
//   avatarCompany: z.string().optional(),
//   isRemote: z.boolean().default(true),
//   expirationDate: z.date().refine(
//     (date) => !isBefore(date, new Date()) || isToday(date),
//     "Expiration date cannot be in the past"
//   ),
//   location: z.object({
//     province: z.string().min(1, "Province is required"),
//     district: z.string().min(1, "District is required"),
//     address: z.string().min(1, "Address is required"),
//   }),
// });

// type JobFormValues = z.infer<typeof jobFormSchema>;

// export default function PostAJob() {
//   const router = useRouter();
//   const [logoFile, setLogoFile] = useState<File | null>(null);

//   // Initialize form with react-hook-form and zod resolver
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//     trigger,
//   } = useForm<JobFormValues>({
//     resolver: zodResolver(jobFormSchema),
//     defaultValues: {
//       jobTitle: "",
//       jobType: "full-time",
//       tags: [],
//       minSalary: 0,
//       maxSalary: 0,
//       description: "",
//       avatarCompany: "",
//       isRemote: false,
//       expirationDate: new Date(),
//       location: {
//         province: "",
//         district: "",
//         address: "",
//       },
//     },
//   });

//   // Watch values for validation
//   const minSalary = watch("minSalary");
//   const maxSalary = watch("maxSalary");
//   const avatarCompany = watch("avatarCompany");

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setLogoFile(file);
//       const previewURL = URL.createObjectURL(file);
//       setValue("avatarCompany", previewURL);
//     }
//   };

//   const onSubmit = async (data: JobFormValues) => {
//     if (data.maxSalary < data.minSalary) {
//       toast.error("Max Salary must be greater than or equal to Min Salary.");
//       return;
//     }

//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (!user) {
//         toast.error("You must be logged in to post a job.");
//         return;
//       }

//       const userDocRef = doc(db, "users", user.uid);
//       const userSnapshot = await getDoc(userDocRef);

//       if (!userSnapshot.exists()) {
//         toast.error("User profile not found.");
//         return;
//       }

//       const userData = userSnapshot.data();
//       const name = userData.name || "Unknown Company";
//       let base64Logo = "";

//       if (logoFile) {
//         base64Logo = await toBase64(logoFile);
//       }

//       const docRef = doc(collection(db, "jobs"));

//       const jobData: Job = {
//         jobId: docRef.id,
//         employerId: user.uid,
//         jobTitle: data.jobTitle,
//         tags: data.tags,
//         minSalary: data.minSalary,
//         maxSalary: data.maxSalary,
//         description: data.description,
//         jobType: data.jobType as JobType,
//         avatarCompany: base64Logo,
//         companyName: name,
//         urgent: false,
//         location: data.location,
//         isRemote: data.isRemote,
//         expirationDate: data.expirationDate,
//         applicants: [],
//         status: "Active",
//         createdAt: Timestamp.now(),
//       };

//       await setDoc(docRef, jobData);

//       // Reset form
//       setValue("jobTitle", "");
//       setValue("tags", []);
//       setValue("minSalary", 0);
//       setValue("maxSalary", 0);
//       setValue("description", "");
//       setValue("avatarCompany", "");
//       setValue("isRemote", true);
//       setValue("expirationDate", new Date());
//       setValue("location", { province: "", district: "", address: "" });
//       setLogoFile(null);

//       router.push(`/find-job/${jobData.jobId}`);
//       toast.success("Created job!");
//     } catch (error) {
//       console.error("Error uploading job:", error);
//       toast.error("An error occurred while posting the job.");
//     }
//   };

//   return (
//     <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
//       <h1 className="text-xl font-semibold text-gray-800 mb-6">Post a Job</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div className="flex space-x-6 ">
//           <div className="flex-1">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Type
//             </label>
//             <Controller
//               name="jobType"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   value={field.value}
//                   onValueChange={field.onChange}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select job type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="full-time">Full-time</SelectItem>
//                     <SelectItem value="part-time">Part-time</SelectItem>
//                     <SelectItem value="freelance">Freelance</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>

//           {/* avatar */}
//           <div className="flex-1">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Company Avatar
//             </label>
//             <div className="flex items-center gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() =>
//                   document.getElementById("avatar-upload")?.click()
//                 }
//                 className="flex items-center gap-2"
//               >
//                 <Upload size={16} />
//                 Upload Image
//               </Button>

//               <input
//                 id="avatar-upload"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </div>
//             {avatarCompany && (
//               <Image
//                 src={avatarCompany}
//                 alt="Company Avatar Preview"
//                 width={80}
//                 height={80}
//                 className="mt-2 rounded-full border border-gray-300 shadow-sm object-cover"
//               />
//             )}
//           </div>
//         </div>

//         {/* Job Title */}
//         <div className="">
//           <label className="block mb-2 text-sm font-medium text-gray-700">
//             Job Title
//           </label>
//           <Input
//             className={cn(
//               "focus:ring-2 focus:ring-blue-500 rounded-md",
//               errors.jobTitle ? "border-red-500" : "border-gray-300"
//             )}
//             placeholder="Add job title, role, vacancies etc."
//             {...register("jobTitle")}
//           />
//           {errors.jobTitle && (
//             <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>
//           )}
//         </div>

//         {/* Location */}
//         <div className="">
//           <Controller
//             name="location"
//             control={control}
//             render={({ field }) => (
//               <LocationSelector
//                 value={field.value}
//                 onChange={(loc) => {
//                   field.onChange(loc);
//                   // Trigger validation on change
//                   trigger("location");
//                 }}
//                 provinces={provinces}
//                 errors={{
//                   province: errors.location?.province?.message,
//                   district: errors.location?.district?.message,
//                   address: errors.location?.address?.message,
//                 }}
//               />
//             )}
//           />
//         </div>

//         {/* Tags */}
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">
//             Tags
//           </label>
//           <Controller
//             name="tags"
//             control={control}
//             render={({ field }) => (
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-start text-left",
//                       errors.tags ? "border-red-500" : ""
//                     )}
//                   >
//                     {field.value.length > 0
//                       ? field.value.join(", ")
//                       : "Select job tags"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[400px] p-4 max-h-[300px] overflow-y-auto">
//                   <div className="flex flex-wrap gap-2">
//                     {JOB_TAG_OPTIONS.map((tag) => {
//                       const isSelected = field.value.includes(tag);
//                       return (
//                         <Button
//                           key={tag}
//                           type="button"
//                           variant={isSelected ? "default" : "outline"}
//                           onClick={() => {
//                             const updatedTags = isSelected
//                               ? field.value.filter((t) => t !== tag)
//                               : [...field.value, tag];

//                             field.onChange(updatedTags);
//                             // Trigger validation after selection
//                             trigger("tags");
//                           }}
//                           className="text-sm rounded-full"
//                         >
//                           {tag}
//                         </Button>
//                       );
//                     })}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             )}
//           />
//           {errors.tags && (
//             <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
//           )}
//         </div>

//         {/* Salary */}
//         <div>
//           <h2 className="text-base font-medium text-gray-800 mb-2">Salary</h2>
//           <div className="flex flex-wrap gap-4">
//             <div className="flex-1 min-w-[180px]">
//               <label className="block text-xs text-gray-500 mb-1">
//                 Min Salary
//               </label>
//               <div className="flex">
//                 <Controller
//                   name="minSalary"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       type="number"
//                       placeholder="Minimum salary"
//                       className={cn(
//                         "rounded-r-none",
//                         errors.minSalary ? "border-red-500" : ""
//                       )}
//                       {...field}
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   )}
//                 />
//                 <span className="px-3 py-2.5 pb-1.5 border border-l-0 border-gray-200 rounded-r-md text-gray-500 bg-gray-50 text-sm flex items-center">
//                   USD
//                 </span>
//               </div>
//               {errors.minSalary && (
//                 <p className="text-red-500 text-xs mt-1">{errors.minSalary.message}</p>
//               )}
//             </div>
//             <div className="flex-1 min-w-[180px]">
//               <label className="block text-xs text-gray-500 mb-1">
//                 Max Salary
//               </label>
//               <div className="flex">
//                 <Controller
//                   name="maxSalary"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       type="number"
//                       placeholder="Maximum salary"
//                       className={cn(
//                         "rounded-r-none",
//                         errors.maxSalary ? "border-red-500" : ""
//                       )}
//                       {...field}
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   )}
//                 />
//                 <span className="px-3 py-2.5 pb-1.5 border border-l-0 border-gray-200 rounded-r-md text-gray-500 bg-gray-50 text-sm flex items-center">
//                   USD
//                 </span>
//               </div>
//               {errors.maxSalary && (
//                 <p className="text-red-500 text-xs mt-1">{errors.maxSalary.message}</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Expiration Date */}
//         <div>
//           <label className="block text-xs text-gray-500 mb-1">
//             Expiration Date
//           </label>
//           <Controller
//             name="expirationDate"
//             control={control}
//             render={({ field }) => (
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-between",
//                       !field.value && "text-muted-foreground",
//                       errors.expirationDate ? "border-red-500" : ""
//                     )}
//                   >
//                     {field.value
//                       ? format(field.value, "PPP")
//                       : "Pick a date"}
//                     <FaCalendarAlt className="ml-2 h-4 w-4 text-gray-400" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar
//                     mode="single"
//                     selected={field.value}
//                     onSelect={(date) => {
//                       field.onChange(date || new Date());
//                       trigger("expirationDate");
//                     }}
//                     disabled={(date) =>
//                       isBefore(date, new Date()) && !isToday(date)
//                     }
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             )}
//           />
//           {errors.expirationDate && (
//             <p className="text-red-500 text-xs mt-1">{errors.expirationDate.message}</p>
//           )}
//         </div>

//         {/* Remote Checkbox */}
//         <div className="flex items-center space-x-2">
//           <Controller
//             name="isRemote"
//             control={control}
//             render={({ field }) => (
//               <Checkbox
//                 id="isRemote"
//                 checked={field.value}
//                 onCheckedChange={field.onChange}
//               />
//             )}
//           />
//           <label htmlFor="isRemote" className="text-sm text-gray-700">
//             Fully Remote Position - Worldwide
//           </label>
//         </div>

//         {/* Job Description */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Job Description
//           </label>
//           <Controller
//             name="description"
//             control={control}
//             render={({ field }) => (
//               <Textarea
//                 placeholder="Add your job description..."
//                 className={cn(
//                   "min-h-[200px]",
//                   errors.description ? "border-red-500" : ""
//                 )}
//                 {...field}
//               />
//             )}
//           />
//           {errors.description && (
//             <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
//           )}
//         </div>

//         {/* Submit */}
//         <div className="flex justify-end">
//           <Button className="cursor-pointer" type="submit">
//             Post Job
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";
import provinces from "../../../../constants/data/location.json";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { collection, Timestamp, getDoc, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@services/firebase/firebase";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday, isBefore } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { cn } from "@component/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { toBase64 } from "@lib/convertBase64";
import { Job, JobType, JOB_TAG_OPTIONS } from "../../../../types/db";
import { useRouter } from "next/navigation";
import LocationSelector from "@component/ui/LocationSelector";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema with zod
const jobFormSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  jobType: z.string().default("full-time"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  minSalary: z.number().min(0, "Min salary must be 0 or greater"),
  maxSalary: z
    .number()
    .min(0, "Max salary must be 0 or greater")
    .refine(
      (data) => true, // This will be validated in the form with custom logic
      { message: "Max salary must be greater than min salary" }
    ),
  description: z.string().min(1, "Description is required"),
  avatarCompany: z.string().optional(),
  isRemote: z.boolean().default(true),
  expirationDate: z
    .date()
    .refine(
      (date) => !isBefore(date, new Date()) || isToday(date),
      "Expiration date cannot be in the past"
    ),
  location: z.object({
    province: z.string().min(1, "Province is required"),
    district: z.string().min(1, "District is required"),
    address: z.string().min(1, "Address is required"),
  }),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function PostAJob() {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Initialize form with react-hook-form and zod resolver
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      jobTitle: "",
      jobType: "full-time",
      tags: [],
      minSalary: 0,
      maxSalary: 0,
      description: "",
      avatarCompany: "",
      isRemote: false,
      expirationDate: new Date(),
      location: {
        province: "",
        district: "",
        address: "",
      },
    },
  });

  // Watch values for validation
  const minSalary = watch("minSalary");
  const maxSalary = watch("maxSalary");
  const avatarCompany = watch("avatarCompany");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewURL = URL.createObjectURL(file);
      setValue("avatarCompany", previewURL);
    }
  };

  const onSubmit = async (data: JobFormValues) => {
    // Validate min and max salary
    if (data.maxSalary < data.minSalary) {
      toast.error("Max Salary must be greater than or equal to Min Salary.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("You must be logged in to post a job.");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        toast.error("User profile not found.");
        return;
      }

      const userData = userSnapshot.data();
      const name = userData.name || "Unknown Company";
      let base64Logo = "";

      if (logoFile) {
        base64Logo = await toBase64(logoFile);
      }

      const docRef = doc(collection(db, "jobs"));

      const jobData: Job = {
        jobId: docRef.id,
        employerId: user.uid,
        jobTitle: data.jobTitle,
        tags: data.tags,
        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        description: data.description,
        jobType: data.jobType as JobType,
        avatarCompany: base64Logo,
        companyName: name,
        urgent: false,
        location: data.location,
        isRemote: data.isRemote,
        expirationDate: data.expirationDate,
        applicants: [],
        status: "Active",
        createdAt: Timestamp.now(),
      };

      await setDoc(docRef, jobData);

      // Reset form
      setValue("jobTitle", "");
      setValue("tags", []);
      setValue("minSalary", 0);
      setValue("maxSalary", 0);
      setValue("description", "");
      setValue("avatarCompany", "");
      setValue("isRemote", true);
      setValue("expirationDate", new Date());
      setValue("location", { province: "", district: "", address: "" });
      setLogoFile(null);

      router.push(`/find-job/${jobData.jobId}`);
      toast.success("Created job!");
    } catch (error) {
      console.error("Error uploading job:", error);
      toast.error("An error occurred while posting the job.");
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)] mt-6 p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Post a Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex space-x-6 ">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Type
            </label>
            <Controller
              name="jobType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* avatar */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Company Avatar
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Upload Image
              </Button>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {avatarCompany && (
              <Image
                src={avatarCompany}
                alt="Company Avatar Preview"
                width={80}
                height={80}
                className="mt-2 rounded-full border border-gray-300 shadow-sm object-cover"
              />
            )}
          </div>
        </div>

        {/* Job Title */}
        <div className="">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Job Title
          </label>
          <Input
            className={cn(
              "focus:ring-2 focus:ring-blue-500 rounded-md",
              errors.jobTitle ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Add job title, role, vacancies etc."
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-xs mt-1">
              {errors.jobTitle.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <LocationSelector
                value={field.value}
                onChange={(loc) => {
                  field.onChange(loc);
                  // Trigger validation on change
                  trigger("location");
                }}
                provinces={provinces}
                errors={{
                  province: errors.location?.province?.message,
                  district: errors.location?.district?.message,
                  address: errors.location?.address?.message,
                }}
              />
            )}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tags
          </label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left cursor-pointer",
                      errors.tags ? "border-red-500" : ""
                    )}
                  >
                    {field.value.length > 0
                      ? field.value.join(", ")
                      : "Select job tags"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-4 max-h-[300px] overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {JOB_TAG_OPTIONS.map((tag) => {
                      const isSelected = field.value.includes(tag);
                      return (
                        <Button
                          key={tag}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            const updatedTags = isSelected
                              ? field.value.filter((t) => t !== tag)
                              : [...field.value, tag];

                            field.onChange(updatedTags);
                            // Trigger validation after selection
                            trigger("tags");
                          }}
                          className="text-sm rounded-full"
                        >
                          {tag}
                        </Button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.tags && (
            <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
          )}
        </div>

        {/* Salary */}
        <div>
          <h2 className="text-base font-medium text-gray-800 mb-2">Salary</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-500 mb-1">
                Min Salary
              </label>
              <div className="flex">
                <Controller
                  name="minSalary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Minimum salary"
                      className={cn(
                        "rounded-r-none",
                        errors.minSalary ? "border-red-500" : ""
                      )}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <span className="px-3 py-2.5 pb-1.5 border border-l-0 border-gray-200 rounded-r-md text-gray-500 bg-gray-50 text-sm flex items-center">
                  USD
                </span>
              </div>
              {errors.minSalary && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.minSalary.message}
                </p>
              )}
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-500 mb-1">
                Max Salary
              </label>
              <div className="flex">
                <Controller
                  name="maxSalary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Maximum salary"
                      className={cn(
                        "rounded-r-none",
                        errors.maxSalary ? "border-red-500" : ""
                      )}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <span className="px-3 py-2.5 pb-1.5 border border-l-0 border-gray-200 rounded-r-md text-gray-500 bg-gray-50 text-sm flex items-center">
                  USD
                </span>
              </div>
              {errors.maxSalary && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maxSalary.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Expiration Date */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Expiration Date
          </label>
          <Controller
            name="expirationDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-between cursor-pointer",
                      !field.value && "text-muted-foreground",
                      errors.expirationDate ? "border-red-500" : ""
                    )}
                  >
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                    <FaCalendarAlt className="ml-2 h-4 w-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date || new Date());
                      trigger("expirationDate");
                    }}
                    disabled={(date) =>
                      isBefore(date, new Date()) && !isToday(date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.expirationDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.expirationDate.message}
            </p>
          )}
        </div>

        {/* Remote Checkbox */}
        <div className="flex items-center space-x-2">
          <Controller
            name="isRemote"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isRemote"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="cursor-pointer"
              />
            )}
          />
          <label
            htmlFor="isRemote"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Fully Remote Position - Worldwide
          </label>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                placeholder="Add your job description..."
                className={cn(
                  "min-h-[200px]",
                  errors.description ? "border-red-500" : ""
                )}
                {...field}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button className="cursor-pointer" type="submit">
            Post Job
          </Button>
        </div>
      </form>
    </div>
  );
}
