'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";

export default function Home() {
    return (
        <div>
            <Hero />
            <section className="py-32 px-6 bg-[#fdfbf7]">
            <div className="max-w-4xl mx-auto text-center space-y-10">
                <div className="flex justify-center items-center gap-4 mb-4">
                <div className="h-px w-12 bg-[#bfa06b]"></div>
                <h3 className="text-[10px] tracking-[0.6em] uppercase text-[#bfa06b] font-bold">The House of Frost & Wayne</h3>
                <div className="h-px w-12 bg-[#bfa06b]"></div>
                </div>
                <p className="font-serif text-3xl md:text-6xl leading-tight text-[#3d2b1f] font-medium">
                "True luxury is found in the <span className="italic font-light text-[#8b5e3c]">quiet details</span> and the legacy of craftsmanship."
                </p>
                <p className="text-sm text-[#3d2b1f]/60 max-w-2xl mx-auto tracking-wide leading-loose">
                Since 1892, Frost & Wayne has curated the world's most exceptional textiles and technologies for those who command the highest standards of living.
                </p>
            </div>
            </section>
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
