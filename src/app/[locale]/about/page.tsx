import type { Metadata } from "next";
import { getAboutMetadata } from "@/services/metadataService";
import AboutPageClient from "./AboutPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getAboutMetadata();
}

export default async function About() {
  return <AboutPageClient />;
}
