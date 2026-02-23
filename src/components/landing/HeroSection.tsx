interface HeroSectionProps {
    scrollTo: (id: string) => void;
}

const HeroSection = ({ scrollTo }: HeroSectionProps) => (
    <section id="home" className="lp-hero">
        <div className="lp-hero__orb-top" />
        <div className="lp-hero__orb-bottom" />

        <div className="lp-hero__content">
            <div className="lp-hero__badge">
                <span>🎓</span> CIT-U Campus Platform
            </div>
            <h1 className="lp-hero__title">
                Borrow Smarter.{" "}
                <span className="lp-hero__title-accent">Share</span> Responsibly.
            </h1>
            <p className="lp-hero__subtitle">
                A campus-exclusive equipment borrowing platform designed for CIT-U students.
            </p>
            <p className="lp-hero__desc">
                TechnoBorrow enables verified students to post borrowing requests, offer equipment,
                and manage transactions securely within the university community.
            </p>
            <div className="lp-hero__btns">
                <button
                    className="lp-hero__btn-primary"
                    onClick={() => scrollTo("cta")}
                >
                    Create Account
                </button>
                <button
                    className="lp-hero__btn-secondary"
                    onClick={() => scrollTo("cta")}
                >
                    Sign In
                </button>
            </div>
        </div>
    </section>
);

export default HeroSection;
