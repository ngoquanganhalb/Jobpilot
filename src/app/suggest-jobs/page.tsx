import Breadcrumb from "@component/Breadcrumb";
import Footer from "@component/Footer";
import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
import Filter from "@modules/app/findjob/components/Filter";
import SuggestJob from "@modules/client/suggest-jobs/SuggestJobs";

export default function SuggestJobPage() {
  return (
    <>
      <Header />
      <SearchBar />
      <Breadcrumb />
      <Filter />
      <SuggestJob />
      <Footer />
    </>
  );
}
