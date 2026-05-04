import "./landing.css";
import NavSection from "./NavSection";
import HeroSection from "./HeroSection";
import WhatIsSection from "./WhatIsSection";

import HowItWorksSection from "./HowItWorksSection";
import PlatformFeaturesSection from "./PlatformFeaturesSection";
import AboutSection from "./AboutSection";
import CTASection from "./CTASection";
import FooterSection from "./FooterSection";

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
                {/* <CorePrinciplesSection /> */}
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
