"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Cv, Experience, Education } from "../../../types/db";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import CVTemplate from "./components/CvTemplate";
import { EditCv } from "./components/EditCv";
import Button from "@component/ui/ButtonCustom";
import { useGetUserCv } from "@hooks/cv/useGetUserCv";
import { useUpdateCv } from "@hooks/cv/useUpdateCv";
import { useCreateCv } from "@hooks/cv/useCreateCv";
import { useDeleteCv } from "@hooks/cv/useDeleteCv";
import { PERMISSIONS } from "@/permission/Permission.const";
import { PermissionGate } from "@/permission/PermissionGate";
import { usePermission } from "@/permission/UsePermission";

const emptyExperience = (): Experience => ({
  company: "",
  position: "",
  duration: "",
  description: "",
});

const emptyEducation = (): Education => ({
  school: "",
  degree: "",
  duration: "",
});

const CvManagement: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: cvs, refetch } = useGetUserCv();
  const { updateCvMutation } = useUpdateCv();
  const { createCvMutation } = useCreateCv();
  const { deleteCvMutation } = useDeleteCv();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCv, setCurrentCv] = useState<Cv | undefined>(undefined);

  const blankForm = {
    name: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    summary: "",
    experience: [emptyExperience()],
    education: [emptyEducation()],
    skills: [] as string[],
    isActive: false,
    userId: user?.id,
    image: "",
    theme: null,
    fileUrl:
      "https://res.cloudinary.com/davkp2wja/raw/upload/v1766315338/cv/eufsrcuyzxmhe5bt52z6.pdf",
  };

  const [formData, setFormData] = useState<any>({ ...blankForm });
  const resetForm = () => {
    setFormData({ ...blankForm, userId: user?.id });
    setCurrentCv(undefined);
  };
  const { hasPermission: hasUpdateCvPermission } = usePermission([
    PERMISSIONS.CV.UPDATE,
  ]);
  const { hasPermission: hasDeleteCvPermission } = usePermission([
    PERMISSIONS.CV.DELTE,
  ]);
  const { hasPermission: hasCreateCvPermission } = usePermission([
    PERMISSIONS.CV.CREATE,
  ]);
  const { hasPermission: hasActiveAI } = usePermission([
    PERMISSIONS.CV.FIND_SIMILAR_JOB,
  ]);
  const handleOpenModal = (cv?: Cv) => {
    if (cv && cv.id) {
      setCurrentCv(cv);
      // clone để tránh mutate trực tiếp
      setFormData(JSON.parse(JSON.stringify(cv)));
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleExperienceChange = (
    index: number,
    key: keyof Experience,
    value: any
  ) => {
    setFormData((prev: any) => {
      const ex = [...(prev.experience || [])];
      ex[index] = { ...ex[index], [key]: value };
      return { ...prev, experience: ex };
    });
  };

  const addExperience = () => {
    setFormData((prev: any) => ({
      ...prev,
      experience: [...(prev.experience || []), emptyExperience()],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev: any) => {
      const ex = [...(prev.experience || [])];
      ex.splice(index, 1);
      return { ...prev, experience: ex.length ? ex : [emptyExperience()] };
    });
  };

  const handleEducationChange = (
    index: number,
    key: keyof Education,
    value: any
  ) => {
    setFormData((prev: any) => {
      const ed = [...(prev.education || [])];
      ed[index] = { ...ed[index], [key]: value };
      return { ...prev, education: ed };
    });
  };

  const addEducation = () => {
    setFormData((prev: any) => ({
      ...prev,
      education: [...(prev.education || []), emptyEducation()],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev: any) => {
      const ed = [...(prev.education || [])];
      ed.splice(index, 1);
      return { ...prev, education: ed.length ? ed : [emptyEducation()] };
    });
  };

  const handleAddSkill = (skill: string) => {
    if (!skill) return;
    setFormData((prev: any) => ({
      ...prev,
      skills: [...(prev.skills || []), skill],
    }));
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev: any) => {
      const s = [...(prev.skills || [])];
      s.splice(index, 1);
      return { ...prev, skills: s };
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentCv && currentCv.id) {
      await updateCvMutation(currentCv.id, formData);
    } else {
      await createCvMutation(formData);
    }
    handleCloseModal();
    refetch();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await deleteCvMutation(id);
      refetch();
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    await updateCvMutation(id, { isActive: isActive });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">CVs</div>
            <div className="text-2xl font-bold text-gray-900">
              {cvs?.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Find Job AI</div>
            <div className="text-2xl font-bold text-green-600">
              {cvs?.filter((cv) => cv.isActive).length}
            </div>
          </div>
          <div className=" flex justify-end">
            <Button
              onClick={() => handleOpenModal(undefined)}
              hidden={!hasCreateCvPermission}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create CV
            </Button>
          </div>
        </div>

        {/* CV List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs?.map((cv) => (
            <div
              key={cv.id}
              className={`group relative rounded-lg border p-4 overflow-hidden transition-shadow
    ${
      cv.isActive
        ? "bg-green-50 border-green-500 shadow-md" 
        : "bg-white border-gray-200 hover:shadow-lg"
    } 
  `}
              style={{ minHeight: 160 }}
            >
              <div className="absolute inset-0 z-10 flex justify-center items-center p-3 pointer-events-none">
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-80 transition-all pointer-events-none rounded-lg"></div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto flex gap-2 z-20">
                  <button
                    onClick={() => toggleActive(cv.id!, !cv.isActive)}
                    hidden={!hasActiveAI}
                    className={`px-3 py-1 text-sm font-medium border shadow-sm transition-colors ${
                      cv.isActive
                        ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                    title={
                      cv.isActive
                        ? "Tắt trạng thái đang tìm việc"
                        : "Bật trạng thái đang tìm việc"
                    }
                  >
                    {cv.isActive ? "Active" : "In Active"}
                  </button>

                  <button
                    onClick={() => handleOpenModal(cv)}
                    hidden={!hasUpdateCvPermission}
                    className="px-2 py-1 text-xs font-medium bg-blue-800 text-white shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                    title="Edit CV"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cv.id!)}
                    hidden={!hasDeleteCvPermission}
                    className="px-2 py-1 text-xs font-medium bg-red-700 text-white shadow-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                    title="Delete CV"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Compact preview: render template but compact prop => font/ảnh/padding phù hợp */}
              {/* inside map */}
              <div className="w-full h-full ">
                <div className="flex flex-col gap-2">
                  <span className="font-bold">
                    File name: {cv.name ?? "None"}
                  </span>
                  <CVTemplate data={cv} embedded={true} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {cvs?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No Cv Founded</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center pt-10 md:pt-0">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={handleCloseModal}
          />

          <div className="relative z-10 w-[95%] md:w-[90%] lg:w-4/5 max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">
                {currentCv && currentCv.id ? "Edit CV" : "Create new CV"}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCloseModal}
                  className="!px-3 !py-1 !text-sm rounded bg-gray-500 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="!px-3 !py-1 !text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 max-h-[80vh] overflow-auto">
              <EditCv
                formData={formData as Cv}
                handlers={{
                  handleInputChange,
                  handleExperienceChange,
                  addExperience,
                  removeExperience,
                  handleEducationChange,
                  addEducation,
                  removeEducation,
                  handleAddSkill,
                  handleRemoveSkill,
                  handleSubmit,
                  handleCloseModal,
                }}
              />

              <div className="space-y-4">
                <div className="sticky top-6">
                  <CVTemplate
                    data={
                      currentCv && currentCv.id
                        ? (formData as Cv)
                        : (formData as Cv)
                    }
                    isEdit={Boolean(currentCv && currentCv.id)}
                    isCreate={!(currentCv && currentCv.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CvManagementPage: React.FC = () => {
  return (
    <PermissionGate scopes={[PERMISSIONS.CV.LIST, PERMISSIONS.CV.VIEW]}>
      <CvManagement />
    </PermissionGate>
  );
};

CvManagementPage.displayName = "CvManagementPage";

export default CvManagementPage;
