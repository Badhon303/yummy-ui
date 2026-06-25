import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StorySection from "@/components/home/StorySection";
import StatsCounter from "@/components/home/StatsCounter";
import OutletsTeaser from "@/components/home/OutletsTeaser";
import Testimonials from "@/components/home/Testimonials";
import GallerySection from "@/components/home/GallerySection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategoryGrid />
      <FeaturedProducts />
      <StorySection />
      <StatsCounter />
      <OutletsTeaser />
      <Testimonials />
      <GallerySection />
    </>
  );
}
