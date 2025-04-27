import SearchBar from "@component/SearchBar";
import ListJob from "./components/ListJob";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Banner from "./components/Banner";
export default function HomePageModule() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <div>
      <Banner />
      {/* <div className="p-6">
        <h1>Xin chào, {user.name || "bạn"}!</h1>
        <p>User ID: {user.id}</p>
        {user.isAdmin && <p>(Admin quyền lực )</p>}
      </div> */}
      <ListJob />
    </div>
  );
}
