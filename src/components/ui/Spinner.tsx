import { PulseLoader } from "react-spinners";
export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent">
      <PulseLoader color="#3b82f6" size={15} />
    </div>
  );
}
