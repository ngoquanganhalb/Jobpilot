import React, { useRef } from "react";
import { Cv, Education, Experience } from "../../../../types/db";

interface CVTemplateProps {
  data: Cv;
  isView?: boolean;
  isEdit?: boolean;
  isCreate?: boolean;
  compact?: boolean;
  embedded?: boolean; // new: full two-column preview for list (smaller sizes)
}

const SectionTitle: React.FC<{
  children: React.ReactNode;
  compact?: boolean;
  embedded?: boolean;
}> = ({ children, compact, embedded }) => {
  const base = "font-bold uppercase pb-1 mb-3 text-gray-800";
  if (compact)
    return (
      <h2 className={`${base} text-xs border-b border-orange-400`}>
        {children}
      </h2>
    );
  if (embedded)
    return (
      <h2 className={`${base} text-sm border-b border-orange-400`}>
        {children}
      </h2>
    );
  return (
    <h2 className={`${base} text-lg border-b-2 border-orange-500`}>
      {children}
    </h2>
  );
};

const ExperienceItem: React.FC<{
  item: Experience;
  compact?: boolean;
  embedded?: boolean;
}> = ({ item, compact, embedded }) => {
  const small = compact || embedded;
  return (
    <div className={`${small ? "mb-2" : "mb-4"} avoid-page-break`}>
      <div className="flex justify-between items-start">
        <h3
          className={`${small ? "text-sm font-semibold" : "text-base font-semibold"} text-gray-800`}
        >
          {item.position}
        </h3>
        <span
          className={`${small ? "text-xs" : "text-sm font-medium"} text-gray-600`}
        >
          {item.duration}
        </span>
      </div>
      <p
        className={`${small ? "text-xs font-medium text-orange-500" : "text-sm font-medium text-orange-600 mb-1"}`}
      >
        {item.company}
      </p>
      <p
        className={`${small ? "text-xs leading-snug text-gray-700" : "text-sm text-gray-700 leading-snug"}`}
      >
        {item.description}
      </p>
    </div>
  );
};

const EducationItem: React.FC<{
  item: Education;
  compact?: boolean;
  embedded?: boolean;
}> = ({ item, compact, embedded }) => {
  const small = compact || embedded;
  return (
    <div className={`${small ? "mb-2" : "mb-3"} avoid-page-break`}>
      <div className="flex justify-between items-center">
        <h3
          className={`${small ? "text-sm font-semibold" : "text-base font-semibold"} text-gray-800`}
        >
          {item.degree}
        </h3>
        <span className={`${small ? "text-xs" : "text-sm text-gray-600"}`}>
          {item.duration}
        </span>
      </div>
      <p
        className={`${small ? "text-xs text-gray-700" : "text-sm text-gray-700"}`}
      >
        {item.school}
      </p>
    </div>
  );
};

const CVTemplate: React.FC<CVTemplateProps> = ({
  data,
  isView = false,
  isEdit = false,
  isCreate = false,
  compact = false,
  embedded = false,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const {
    fullName = "",
    title = "",
    email = "",
    phone = "",
    address = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
  } = (data || ({} as Cv)) as Cv;

  // compact or view small horizontal card
  if (compact || isView) {
    const small = compact || isView;
    return (
      <div className="w-full flex items-center gap-3">
        <div
          className={`${small ? "w-12 h-12 text-lg" : "w-16 h-16 text-2xl"} flex-shrink-0 rounded-full bg-gray-600 overflow-hidden flex items-center justify-center text-white font-bold`}
        >
          {fullName ? fullName[0] : "A"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={`${small ? "text-sm font-semibold" : "text-lg font-bold"} text-gray-800 truncate`}
              >
                {fullName || "Tên ứng viên"}
              </h3>
              <p
                className={`${small ? "text-xs text-gray-600" : "text-sm text-orange-400"}`}
              >
                {title}
              </p>
            </div>
            <div
              className={`${small ? "text-xs text-gray-500" : "text-sm text-gray-600"}`}
            >
              {email}
            </div>
          </div>
          {summary ? (
            <p
              className={`${small ? "text-xs text-gray-600 mt-1 truncate" : "text-sm text-gray-700 mt-2"}`}
            >
              {summary}
            </p>
          ) : null}
          {skills && skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  className={`${small ? "text-xs px-2 py-0.5" : "text-sm px-2 py-1"} bg-gray-100 rounded`}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Embedded: full right-side layout but smaller sizes so it fits list
  if (embedded) {
    return (
      <div className="w-full bg-white flex gap-4 items-start" ref={rootRef}>
        {/* Left column (smaller) */}
        <div className="flex-shrink-0 w-1/3 min-w-[160px] bg-gray-800 text-white p-4 flex flex-col items-center rounded">
          <div
            className={`${true ? "w-12 h-12" : "w-16 h-16"} flex-shrink-0 rounded-full bg-gray-600 overflow-hidden flex items-center justify-center text-white font-bold`}
          >
            {data?.image ? (
              <img
                src={data.image}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`${true ? "text-lg" : "text-2xl"}`}>
                {fullName ? fullName[0] : "A"}
              </div>
            )}
          </div>

          <h1 className="text-lg font-bold uppercase mb-1 text-white text-center">
            {fullName}
          </h1>
          <h2 className="text-sm font-medium text-orange-400 mb-3 text-center">
            {title}
          </h2>

          <div className="w-full mb-3 text-xs">
            <h3 className="font-semibold uppercase tracking-wider border-b border-orange-500 pb-1 mb-2 text-white">
              Information
            </h3>
            <ul className="space-y-1 text-white">
              <li className="flex items-center">
                <span className="mr-2">📞</span> {phone}
              </li>
              <li className="flex items-center">
                <span className="mr-2">📧</span> {email}
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span> {address}
              </li>
            </ul>
          </div>

          <div className="w-full text-xs">
            <h3 className="font-semibold uppercase tracking-wider border-b border-orange-500 pb-1 mb-2 text-white">
              Skills
            </h3>
            <div className="flex flex-wrap gap-1">
              {skills && skills.length > 0 ? (
                skills.slice(0, 6).map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white text-gray-800 rounded text-xs"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <div className="text-white text-xs">None</div>
              )}
            </div>
          </div>
        </div>

        {/* Right column (smaller padding / font) */}
        <div className="flex-1 p-3">
          <div className="mb-3">
            <SectionTitle embedded> Career goal </SectionTitle>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
              {summary}
            </p>
          </div>

          <div className="mb-3">
            <SectionTitle embedded> Education </SectionTitle>
            {education && education.length > 0 ? (
              education.map((edu, i) => (
                <EducationItem key={i} item={edu} embedded />
              ))
            ) : (
              <p className="text-xs text-gray-600">None</p>
            )}
          </div>

          <div className="mb-3">
            <SectionTitle embedded> Experience </SectionTitle>
            {experience && experience.length > 0 ? (
              experience
                .slice(0, 2)
                .map((exp, i) => <ExperienceItem key={i} item={exp} embedded />)
            ) : (
              <p className="text-xs text-gray-600">None</p>
            )}
          </div>

          {(isEdit || isCreate) && (
            <div className="mt-3 p-2 border border-dashed rounded text-xs text-gray-600">
              {isCreate ? "Tạo mới" : "Chỉnh sửa"}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default full template (modal large). Note: changed to flexible height and print-friendly rules.
  return (
    <div className="w-full flex justify-center">
      <div
        className="max-w-4xl w-full bg-white shadow-none flex flex-col md:flex-row print:bg-white"
        ref={rootRef}
      >
        {/* Left column */}
        <div className="w-full md:w-1/3 bg-gray-800 text-white p-6 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-600 rounded-full mb-4 overflow-hidden flex items-center justify-center">
            {data.image ? (
              <img
                src={data.image}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl font-bold text-white">
                {fullName ? fullName[0] : "A"}
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold uppercase mb-1 text-white">
            {fullName}
          </h1>
          <h2 className="text-lg font-medium text-orange-400 mb-6">{title}</h2>

          <div className="w-full mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-orange-500 pb-1 mb-3 text-white">
              Information
            </h3>
            <ul className="text-sm space-y-2 text-white">
              <li className="flex items-center">
                <span className="mr-2">📞</span> {phone}
              </li>
              <li className="flex items-center">
                <span className="mr-2">📧</span> {email}
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span> {address}
              </li>
            </ul>
          </div>

          <div className="w-full mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-orange-500 pb-1 mb-3 text-white">
              Skills
            </h3>
            <ul className="text-sm space-y-1 text-white">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <li key={index} className="font-light">
                    - {skill}
                  </li>
                ))
              ) : (
                <li className="font-light">None</li>
              )}
            </ul>
          </div>

          <div className="w-full hidden md:block">
            {/* placeholder to keep left column height */}
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-2/3 p-8">
          <div className="mb-6 avoid-page-break">
            <SectionTitle> Career goal </SectionTitle>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </div>

          <div className="mb-6 avoid-page-break">
            <SectionTitle> Education </SectionTitle>
            {education && education.length > 0 ? (
              education.map((edu, index) => (
                <EducationItem key={index} item={edu} />
              ))
            ) : (
              <p className="text-sm text-gray-600">None</p>
            )}
          </div>

          <div className="mb-6 avoid-page-break">
            <SectionTitle> Experience </SectionTitle>
            {experience && experience.length > 0 ? (
              experience.map((exp, index) => (
                <ExperienceItem key={index} item={exp} />
              ))
            ) : (
              <p className="text-sm text-gray-600">None</p>
            )}
          </div>
        </div>
      </div>

      {/* Print-friendly CSS inserted here so print rules apply without external files */}
      <style>
        {`@media print {
  body { -webkit-print-color-adjust: exact; }
  .print\:hidden { display: none !important; }
  .avoid-page-break { page-break-inside: avoid; break-inside: avoid; }
  .page-break { page-break-after: always; break-after: page; }
  .max-w-4xl { max-width: 1024px; }
}

/* Make sure long content wraps and layout is flexible */
.avoid-page-break { -webkit-column-break-inside: avoid; }
`}
      </style>
    </div>
  );
};

export default CVTemplate;
