import Image from "next/image";
import BannerHeaderImage from "../../assets/BannerHome.png";

export default function BannerHeader() {
  return <Image src={BannerHeaderImage} alt="Banner-Header" />;
}
