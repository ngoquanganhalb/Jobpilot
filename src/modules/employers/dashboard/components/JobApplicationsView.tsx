"use client";
import { useState, useEffect, type FC } from "react";
import { useParams } from "next/navigation";
import { db } from "@services/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  MoreHorizontal,
  Trash2,
  Download,
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
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { StatusBadge } from "@component/ui/StatusBadge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Application } from "../../../../types/db";
import { APPLICATION_STATUS } from "@/common/enum";
import { useFindUser } from "@hooks/user/useFindUser";
import { useFetchApplication } from "@hooks/applications/useFetchApplication";
import { useSendNotification } from "@hooks/notification/useSendNotification";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

export default function JobApplicationsView() {
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [applications, setApplications] = useState<Application[]>([]);
  const params = useParams(); //take id url
  const jobId = params?.id as string;
  const { mutateAsync: mutateSendNotification } = useSendNotification();
  //feedback
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [feedbackTarget, setFeedbackTarget] = useState<{
    applicationId: string;
    newStatus: Application["status"];
    applicationName: string;
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const isValidStatusTransition = (
    currentStatus: Application["status"],
    newStatus: Application["status"]
  ): boolean => {
    const invalidTransitions: Record<
      Application["status"],
      Application["status"][]
    > = {
      pending: [],
      reviewed: [APPLICATION_STATUS.PENDING],
      interview: [APPLICATION_STATUS.PENDING, APPLICATION_STATUS.REVIEWED],
      rejected: [
        APPLICATION_STATUS.PENDING,
        APPLICATION_STATUS.REVIEWED,
        APPLICATION_STATUS.INTERVIEW,
        APPLICATION_STATUS.HIRED,
      ],
      hired: [
        APPLICATION_STATUS.PENDING,
        APPLICATION_STATUS.REVIEWED,
        APPLICATION_STATUS.INTERVIEW,
        APPLICATION_STATUS.REJECTED,
      ],
    };
    return !invalidTransitions[currentStatus]?.includes(newStatus);
  };
  const { data = [] } = useFetchApplication(jobId);
  const { data: additionalData, isLoading } = useFindUser(
    data.map((i) => i.candidateId)
  );
  const beginApplication: Application[] = data.map((application) => {
    if (isLoading || !additionalData) {
      return application;
    }
    const user = additionalData?.find((user) => {
      return user.id === Number(application.candidateId);
    });
    return {
      ...application,
      name: user?.name,
      avatar: user?.avatar,
    };
  });
  useEffect(() => {
    if (beginApplication.length > 0) {
      setApplications(beginApplication);
    } else {
    }
  }, [data, additionalData]);

  const handleDeleteApplication = async (
    applicationId: string,
    applicationName: string
  ) => {
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app.id !== applicationId)
    );
    const applicationRef = doc(db, "applications", applicationId);
    await updateDoc(applicationRef, { status: APPLICATION_STATUS.REJECTED });
    await updateDoc(applicationRef, { showEmployer: false });
    toast.success(`Application: ${applicationName} deleted`);
  };

  const handleChangeStatus = (
    applicationId: string,
    newStatus: Application["status"],
    applicationName: string
  ) => {
    const currentApp = applications.find((app) => app.id === applicationId);
    if (!currentApp) return;

    if (!isValidStatusTransition(currentApp.status, newStatus)) {
      toast.error(
        `Invalid transition from "${currentApp.status}" to "${newStatus}"`
      );
      return;
    }

    // if status needs feedback -> popup form
    if (
      [
        APPLICATION_STATUS.INTERVIEW,
        APPLICATION_STATUS.REJECTED,
        APPLICATION_STATUS.HIRED,
      ].includes(newStatus)
    ) {
      setFeedbackTarget({ applicationId, newStatus, applicationName });
      setShowFeedbackPopup(true);
    } else {
      // if status no need feedback => update directly
      updateApplicationStatus(applicationId, newStatus, "", applicationName);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: Application["status"],
    feedback: string,
    applicationName: string
  ) => {
    try {
      const app = applications.find((a) => a.id === applicationId);
      if (!app) return;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: newStatus, feedback }
            : app
        )
      );
      const applicationRef = doc(db, "applications", applicationId);
      Promise.all([
        updateDoc(applicationRef, { status: newStatus, feedback }),
        newStatus === APPLICATION_STATUS.INTERVIEW
          ? mutateSendNotification({
              receiverId: Number(app.candidateId),
              url: `${process.env.NEXT_PUBLIC_APP_URL}/video-call`,
              message: feedback,
              type: "SCHEDULE_INTERVIEW",
            })
          : mutateSendNotification({
              receiverId: Number(app.candidateId),
              url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applied-job`,
              message: `Job you applied from Company: ${user?.name} has been updated to ${newStatus} ${feedback ? `with feedback: ${feedback}` : ""}`,
              type: "APPLICATION_STATUS_UPDATE",
            }),
      ]);
      await toast.success(`Changed "${applicationName}" to ${newStatus}`);
    } catch (e: any) {
      await toast.error(e);
    }
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
        (a, b) =>
          (b.appliedAt instanceof Date
            ? b.appliedAt
            : b.appliedAt.toDate()
          ).getTime() -
          (a.appliedAt instanceof Date
            ? a.appliedAt
            : a.appliedAt.toDate()
          ).getTime()
      );
    } else {
      sortedApplications.sort(
        (a, b) =>
          (a.appliedAt instanceof Date
            ? a.appliedAt
            : a.appliedAt.toDate()
          ).getTime() -
          (b.appliedAt instanceof Date
            ? b.appliedAt
            : b.appliedAt.toDate()
          ).getTime()
      );
    }
    setApplications(sortedApplications);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const appIndex = applications.findIndex((app) => app.id === draggableId);
    if (appIndex === -1) return;

    const draggedApp = applications[appIndex];
    const newStatus = destination.droppableId as Application["status"];
    const currentStatus = draggedApp.status;

    // Validate transition
    if (!isValidStatusTransition(currentStatus, newStatus)) {
      toast.error(
        `Invalid transition from "${currentStatus}" to "${newStatus}"`
      );
      return;
    }

    // if status needs feedback -> popup like handleChangStatus
    if (
      [
        APPLICATION_STATUS.INTERVIEW,
        APPLICATION_STATUS.REJECTED,
        APPLICATION_STATUS.HIRED,
      ].includes(newStatus)
    ) {
      setFeedbackTarget({
        applicationId: draggedApp.id,
        newStatus,
        applicationName: draggedApp.name || "Unknown name",
      });
      setShowFeedbackPopup(true);
      return;
    }

    // update if no need feedback
    try {
      const updatedApp = { ...draggedApp, status: newStatus };
      const newApplications = [...applications];
      newApplications[appIndex] = updatedApp;
      setApplications(newApplications);

      const applicationRef = doc(db, "applications", draggableId);
      await updateDoc(applicationRef, { status: newStatus });

      toast.success(`Updated "${draggedApp.name}" to "${newStatus}"`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Function to group applications by status
  const getApplicationsByStatus = (status: Application["status"]) => {
    return applications.filter((app) => app.status === status);
  };

  const ApplicantCard = ({
    application,
    index,
  }: {
    application: Application;
    index: number;
  }) => {
    const [expanded, setExpanded] = useState(false);
    const isLongNote = application.note && application.note.length > 100;
    const shortNote = isLongNote
      ? (application.note ?? "").slice(0, 100) + "..."
      : application.note;
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
                  alt="aa"
                  className="w-12 h-12 rounded-full mr-3"
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
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleDownloadCV(application.resumeUrl)
                          }
                        >
                          <Download size={14} /> Download CV
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              APPLICATION_STATUS.PENDING,
                              application.name || "Unknown name"
                            )
                          }
                          disabled={
                            application.status === APPLICATION_STATUS.PENDING
                          }
                        >
                          <ClipboardCheck size={14} /> Mark as New
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              APPLICATION_STATUS.REVIEWED,
                              application.name || "Unknown name"
                            )
                          }
                          disabled={
                            application.status === APPLICATION_STATUS.REVIEWED
                          }
                        >
                          <CheckCircle size={14} /> Mark as Reviewed
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              APPLICATION_STATUS.INTERVIEW,
                              application.name || "Unknown name"
                            )
                          }
                          disabled={
                            application.status === APPLICATION_STATUS.INTERVIEW
                          }
                        >
                          <Phone size={14} /> Schedule Interview
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              APPLICATION_STATUS.REJECTED,
                              application.name || "Unknown name"
                            )
                          }
                          disabled={
                            application.status === APPLICATION_STATUS.REJECTED
                          }
                        >
                          <X size={14} /> Reject
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleChangeStatus(
                              application.id,
                              APPLICATION_STATUS.HIRED,
                              application.name || "Unknown name"
                            )
                          }
                          disabled={
                            application.status === APPLICATION_STATUS.HIRED
                          }
                        >
                          <User size={14} /> Hire
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600 cursor-pointer"
                          onClick={() =>
                            handleDeleteApplication(
                              application.id,
                              application.name || "Unknown name"
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
                          <p className="line-clamp-2 break-words whitespace-normal">
                            {expanded ? application.note : shortNote}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border border-gray-200 shadow-md rounded-lg p-4 text-sm max-w-sm">
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
                      className="text-blue-600 flex items-center gap-1 cursor-pointer"
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
  const ApplicationColumn: FC<{
    title: string;
    status: Application["status"];
    applications: Application[];
    className?: string;
  }> = ({ title, status, applications, className }) => (
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
          Job Applications
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 cursor-pointer"
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
            status={APPLICATION_STATUS.PENDING}
            className="bg-blue-100 text-blue-800 "
            applications={getApplicationsByStatus(APPLICATION_STATUS.PENDING)}
          />
          <ApplicationColumn
            title="Reviewed"
            status={APPLICATION_STATUS.REVIEWED}
            className="bg-purple-100 text-purple-800"
            applications={getApplicationsByStatus(APPLICATION_STATUS.REVIEWED)}
          />
          <ApplicationColumn
            title="Interview"
            status={APPLICATION_STATUS.INTERVIEW}
            className="bg-yellow-100 text-yellow-800"
            applications={getApplicationsByStatus(APPLICATION_STATUS.INTERVIEW)}
          />
          <ApplicationColumn
            title="Rejected"
            status={APPLICATION_STATUS.REJECTED}
            className="bg-red-300 text-red-800"
            applications={getApplicationsByStatus(APPLICATION_STATUS.REJECTED)}
          />
          <ApplicationColumn
            title="Hired"
            status={APPLICATION_STATUS.HIRED}
            className="bg-green-100 text-green-800"
            applications={getApplicationsByStatus(APPLICATION_STATUS.HIRED)}
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

      {/* Dialog feedback */}
      <Dialog open={showFeedbackPopup} onOpenChange={setShowFeedbackPopup}>
        <DialogContent className="max-w-md rounded-xl shadow-lg p-6">
          <DialogTitle className="text-xl font-semibold mb-4">
            Provide Feedback
          </DialogTitle>

          {feedbackTarget && (
            <>
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={
                    applications.find(
                      (app) => app.id === feedbackTarget.applicationId
                    )?.avatar || "/images/avatar.png"
                  }
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <p className="text-sm text-gray-700">
                  For: <strong>{feedbackTarget.applicationName}</strong>
                </p>
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Write your feedback..."
              />

              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowFeedbackPopup(false);
                    setFeedbackTarget(null);
                    setFeedbackText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  onClick={async () => {
                    if (!feedbackText.trim()) {
                      toast.error("Feedback is required");
                      return;
                    }
                    await updateApplicationStatus(
                      feedbackTarget.applicationId,
                      feedbackTarget.newStatus,
                      feedbackText,
                      feedbackTarget.applicationName
                    );
                    setShowFeedbackPopup(false);
                    setFeedbackTarget(null);
                    setFeedbackText("");
                  }}
                >
                  Submit
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
