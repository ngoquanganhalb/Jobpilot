"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@component/ui/dialog";
import { Input } from "@component/ui/Input";
import { Button } from "@component/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { JobPosting } from "@types";
import { useForm } from "react-hook-form";

type EditJobModalProps = {
  open: boolean;
  onClose: () => void;
  job: JobPosting;
};

export default function EditJobPopup({
  open,
  onClose,
  job,
}: EditJobModalProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: job.title,
      type: job.type,
      description: job.description,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await updateDoc(doc(db, "jobs", job.id.toString()), data);
      alert("Job updated successfully!");
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update job.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("title")} placeholder="Job Title" />
          <Input {...register("type")} placeholder="Full-time / Part-time" />
          <Textarea {...register("description")} placeholder="Description" />
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
