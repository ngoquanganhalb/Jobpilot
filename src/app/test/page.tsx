// // app/test/page.tsx
// "use client";
// import { useEffect, useState } from "react";

// export default function TestPage() {
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/protected-data");
//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         setData({ error: "Failed to fetch protected data" });
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-semibold">Test Protected API</h1>
//       <pre className="bg-gray-100 p-2 rounded mt-4">
//         {JSON.stringify(data, null, 2)}
//       </pre>
//     </div>
//   );
// }
