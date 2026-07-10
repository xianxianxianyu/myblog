import type { Metadata } from "next";
import { AboutFinalHero } from "../../components/about-final-hero";

export const metadata: Metadata = {
  title: "About Direction — Josh",
  description: "A restrained, human About page direction.",
};

export default function AboutConceptsPage() {
  return <AboutFinalHero />;
}
