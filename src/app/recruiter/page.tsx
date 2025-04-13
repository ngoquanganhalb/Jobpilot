// import { useState, FormEvent, ChangeEvent } from "react";
// import { firestore } from "../lib/firebase";

// const PostJob: React.FC = () => {
//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [image, setImage] = useState<File | null>(null);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     let imageUrl = "";

//     if (image) {
//       const reader = new FileReader();
//       reader.readAsDataURL(image);
//       reader.onloadend = async () => {
//         const base64data = reader.result as string;
//         const res = await fetch("/api/upload", {
//           method: "POST",
//           body: JSON.stringify({ image: base64data }),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await res.json();
//         imageUrl = data.url;
//         await saveJob(imageUrl);
//       };
//     } else {
//       await saveJob(imageUrl);
//     }
//   };

//   const saveJob = async (imageUrl: string) => {
//     await firestore.collection("jobs").add({
//       title,
//       description,
//       imageUrl,
//       createdAt: new Date(),
//     });
//     alert("Đăng tin việc làm thành công");
//     setTitle("");
//     setDescription("");
//     setImage(null);
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   return (
//     <div>
//       <h1>Đăng tin việc làm</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Tiêu đề việc làm"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           placeholder="Mô tả công việc"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         ></textarea>
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//         <button type="submit">Đăng tin</button>
//       </form>
//     </div>
//   );
// };

// export default PostJob;
