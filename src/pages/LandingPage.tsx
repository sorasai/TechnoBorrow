import "../css/landing.css";
import NavSection from "../components/landing/NavSection";
import HeroSection from "../components/landing/HeroSection";
import WhatIsSection from "../components/landing/WhatIsSection";
import CorePrinciplesSection from "../components/landing/CorePrinciplesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import PlatformFeaturesSection from "../components/landing/PlatformFeaturesSection";
import AboutSection from "../components/landing/AboutSection";
import CTASection from "../components/landing/CTASection";
import FooterSection from "../components/landing/FooterSection";

const LandingPage: React.FC = () => {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />

            <div className="lp-page">
                <NavSection scrollTo={scrollTo} />
                <HeroSection />
                <WhatIsSection />
                <CorePrinciplesSection />
                <HowItWorksSection />
                <PlatformFeaturesSection />
                <AboutSection />
                <CTASection />
                <FooterSection />
            </div>
        </>
    );
};

export default LandingPage;
