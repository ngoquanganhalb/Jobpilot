import Spinner from "@component/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center backdrop-blur-sm bg-transparent z-50">
      <Spinner />
    </div>
  );
}
