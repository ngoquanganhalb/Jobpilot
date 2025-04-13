/*eslint-disable*/
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";

const Login: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lấy thêm thông tin từ Firestore nếu có
      const docRef = doc(db, "users", user.uid); // Giả sử bạn lưu user theo id
      const docSnap = await getDoc(docRef);

      let name = user.displayName || "";
      let isAdmin = false;

      if (docSnap.exists()) {
        const userData = docSnap.data();
        name = userData.name || name;
        isAdmin = userData.isAdmin || false;
      }

      //  Lưu vào Redux
      dispatch(setUser({
        id: user.uid,
        name,
        isAdmin
      }));

      router.push("/");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Đăng nhập</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
