'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import Lookbook from "@/components/ExtraUI";

export default function Home() {
    return (
        <div>
            <Hero />
            <Lookbook />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
