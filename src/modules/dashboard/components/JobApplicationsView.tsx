"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  MoreHorizontal,
  Trash2,
  Download,
  UserPlus,
  Filter,
  User,
  ClipboardCheck,
  Phone,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@component/ui/Button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@component/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@component/ui/radio-group";
import { Label } from "@component/ui/label";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { StatusBadge } from "@component/ui/StatusBadge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Application } from "../../../types/db";
import { db } from "@services/firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Image from "next/image";
import Spinner from "@component/ui/Spinner";

export default function JobApplicationsView() {
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [applications, setApplications] = useState<Application[]>([]);
  const params = useParams(); //take id url
  const jobId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("No Title");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsRef = collection(db, "applications");
        const q = query(
          applicationsRef,
          where("jobId", "==", jobId),
          where("showEmployer", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);
        const jobTitle = jobSnap.exists()
          ? jobSnap.data().jobTitle
          : "No title";
        setJobTitle(jobTitle);
        const apps: Application[] = [];

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();

          // Fetch user info
          const userRef = doc(db, "users", data.candidateId);
          const userSnap = await getDoc(userRef);

          const username = userSnap.exists()
            ? userSnap.data().username
            : "Unknown User";

          const useravatar = userSnap.exists()
            ? userSnap.data().avatar
            : "Unknown avatar";

          apps.push({
            id: docSnap.id,
            jobId: data.jobId,
            candidateId: data.candidateId,
            name: username, // lấy username từ users
            avatar: useravatar,
            appliedAt: data.appliedAt.toDate(),
            status: data.status,
            resumeUrl: data.resumeUrl,
            note: data.note,
            showEmployer: data.showEmployer,
            showCandidate: data.showCandidate,
          });
        }
        setApplications(apps);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const handleDeleteApplication = async (
    applicationId: string,
    applicationName: string
  ) => {
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app.id !== applicationId)
    );
    const applicationRef = doc(db, "applications", applicationId);
    await updateDoc(applicationRef, { status: "rejected" });
    await updateDoc(applicationRef, { showEmployer: false });
    toast.success(`Application: ${applicationName} deleted`);
  };

  const handleChangeStatus = async (
    applicationId: string,
    newStatus: Application["status"],
    applicationName: string
  ) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
    const applicationRef = doc(db, "applications", applicationId);
    await updateDoc(applicationRef, { status: newStatus });
    toast.success(`Changed candidate:"${applicationName}" to ${newStatus}`);
  };

  const handleDownloadCV = (resumeUrl?: string) => {
    if (resumeUrl) {
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSort = (value: string) => {
    setSortOption(value);
    setSortDialogOpen(false);

    const sortedApplications = [...applications];
    if (value === "newest") {
      sortedApplications.sort(
        (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime()
      );
    } else {
      sortedApplications.sort(
        (a, b) => a.appliedAt.getTime() - b.appliedAt.getTime()
      );
    }
    setApplications(sortedApplications);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Create a copy of applications
    const newApplications = [...applications];

    // find aaplication dragged
    const appIndex = newApplications.findIndex((app) => app.id === draggableId);
    if (appIndex === -1) return;

    const newStatus = destination.droppableId;

    // Update its status based on the destination droppableId
    newApplications[appIndex] = {
      ...newApplications[appIndex],
      status: destination.droppableId,
    };

    setApplications(newApplications);

    try {
      const applicationRef = doc(db, "applications", draggableId);
      await updateDoc(applicationRef, { status: newStatus });

      toast.success(`Updated candidate status to "${newStatus}" successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Function to group applications by status
  const getApplicationsByStatus = (status) => {
    return applications.filter((app) => app.status === status);
  };

  const ApplicantCard = ({ application, index }) => {
    const [expanded, setExpanded] = useState(false);

    const isLongNote = application.note && application.note.length > 100;
    const shortNote = isLongNote
      ? application.note.slice(0, 100) + "..."
      : application.note;
    if (loading) return <Spinner />;
    return (
      <Draggable draggableId={application.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-3"
          >
            <Card className="p-4 border border-gray-200 bg-white">
              <div className="flex items-start">
                <img
                  src={application.avatar}
                  alt="avataravatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">
                      {application.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() =>
                            handleDownloadCV(application.resumeUrl)
                          }
                        >
                          <Download size={14} /> Download CV
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              "pending",
                              application.name
                            )
                          }
                          disabled={application.status === "pending"}
                        >
                          <ClipboardCheck size={14} /> Mark as New
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              "reviewed",
                              application.name
                            )
                          }
                          disabled={application.status === "reviewed"}
                        >
                          <CheckCircle size={14} /> Mark as Reviewed
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              "interview",
                              application.name
                            )
                          }
                          disabled={application.status === "interview"}
                        >
                          <Phone size={14} /> Schedule Interview
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              "rejected",
                              application.name
                            )
                          }
                          disabled={application.status === "rejected"}
                        >
                          <X size={14} /> Reject
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              "hired",
                              application.name
                            )
                          }
                          disabled={application.status === "hired"}
                        >
                          <User size={14} /> Hire
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600"
                          onClick={() =>
                            handleDeleteApplication(
                              application.id,
                              application.name
                            )
                          }
                        >
                          <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-2">
                    <StatusBadge status={application.status} />
                  </div>

                  {application.note && (
                    <div className="mt-3 text-sm text-gray-600 italic">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="line-clamp-2">
                            {expanded ? application.note : shortNote}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs ">
                          {application.note}
                        </TooltipContent>
                      </Tooltip>

                      {isLongNote && (
                        <button
                          onClick={() => setExpanded((prev) => !prev)}
                          className="text-blue-500 text-xs mt-1 hover:underline"
                        >
                          {expanded ? "See less" : "See more"}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 flex items-center gap-1"
                      onClick={() => handleDownloadCV(application.resumeUrl)}
                    >
                      <Download size={16} />
                      Resume
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Draggable>
    );
  };
  //shold turn-> componentcomponent
  const ApplicationColumn = ({
    title,
    status,
    applications,
    className,
  }: {
    title: string;
    status: string;
    applications: any[];
    className?: string;
  }) => (
    <div
      className={`border rounded-md h-full flex flex-col ${
        className ?? "bg-gray-200"
      }`}
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
          {title}
          <span className="text-xs bg-white text-gray-600 rounded-full px-2 py-0.5">
            {applications.length}
          </span>
        </h3>
      </div>

      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-2 flex-1 min-h-[200px] max-h-[calc(100vh-250px)] overflow-y-auto space-y-3"
          >
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <ApplicantCard key={app.id} application={app} index={index} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-gray-500">No applicants</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className="">
      {/* Job Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Job Applications: {jobTitle}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSortDialogOpen(true)}
          >
            <Filter size={16} />
            Filter
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <ApplicationColumn
            title="New Applications"
            status="pending"
            className="bg-blue-100 text-blue-800"
            applications={getApplicationsByStatus("pending")}
          />
          <ApplicationColumn
            title="Reviewed"
            status="reviewed"
            className="bg-purple-100 text-purple-800"
            applications={getApplicationsByStatus("reviewed")}
          />
          <ApplicationColumn
            title="Interview"
            status="interview"
            className="bg-yellow-100 text-yellow-800"
            applications={getApplicationsByStatus("interview")}
          />
          <ApplicationColumn
            title="Rejected"
            status="rejected"
            className="bg-red-300 text-red-800"
            applications={getApplicationsByStatus("rejected")}
          />
          <ApplicationColumn
            title="Hired"
            status="hired"
            className="bg-green-100 text-green-800"
            applications={getApplicationsByStatus("hired")}
          />
        </div>
      </DragDropContext>

      {/* Sort Dialog */}
      <Dialog open={sortDialogOpen} onOpenChange={setSortDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Sort Applications</DialogTitle>
          <RadioGroup
            value={sortOption}
            onValueChange={handleSort}
            className="mt-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="newest" id="newest" />
              <Label htmlFor="newest">Newest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oldest" id="oldest" />
              <Label htmlFor="oldest">Oldest</Label>
            </div>
          </RadioGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
}
