import ListJob from "./components/ListJob";
import Banner from "./components/Banner";
import { HowJobpilotWork } from "./components/HowJobpilotWorks";
import { Become } from "./components/Become";
import { PopularCategory } from "./components/PopularCategory";
import { SectionWrapper } from "@component/share/SectionWrapper";

export default function HomePageModule() {
  return (
    <div>
      <SectionWrapper>
        <Banner />
      </SectionWrapper>
      <SectionWrapper>
        <HowJobpilotWork />
      </SectionWrapper>
      <SectionWrapper>
        <PopularCategory />
      </SectionWrapper>
      <SectionWrapper>
        <ListJob />
      </SectionWrapper>
      <SectionWrapper>
        <Become />
      </SectionWrapper>
    </div>
  );
}
