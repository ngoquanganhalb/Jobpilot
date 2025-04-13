import Header from "@component/components/Header";
import Providers from "./Providers";
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* <main>{children}</main> */}
      <main>
        <Providers>{children}</Providers>
      </main>
    </>
  );
}
