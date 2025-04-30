// import Spinner from "@component/ui/Spinner";
// //loading for global
// // handle spinning ưhen <Link href>
// export default function Loading() {
//   return (
//     <>
//       <Spinner />
//     </>
//   );
// }
import Spinner from "@component/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center backdrop-blur-sm bg-transparent z-50">
      <Spinner />
    </div>
  );
}
