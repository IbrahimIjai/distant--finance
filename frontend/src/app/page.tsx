import Heros from "@/ui/landing/heros";
import ProtocolStats from "@/ui/landing/protocol-stats";
import Ads from "../ui/landing/ads";
import ClickLinks from "@/ui/landing/links";
import TopCollections from "@/ui/landing/top-collection";

export default function Home() {
  return (
    <>
      <Heros />
      <ProtocolStats />
      <Ads />
      <ClickLinks />
      <TopCollections />
    </>
  );
}
