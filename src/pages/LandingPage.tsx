import { useState, useEffect, useRef } from "react";
import "../css/landing.css";

/* ──────────────────────────────────────────
   Logo SVG Component
────────────────────────────────────────── */
const LogoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
            d="M12 2L3 7V12C3 16.55 7.0 21.02 12 22C17 21.02 21 16.55 21 12V7L12 2Z"
            fill="white"
            opacity="0.9"
        />
        <path d="M8 11H10V16H14V11H16L12 7L8 11Z" fill="#7A1E2D" />
    </svg>
);

/* ──────────────────────────────────────────
   Main Landing Page Component
────────────────────────────────────────── */
const LandingPage: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    /* Scroll-based nav shadow */
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* Close mobile menu on outside click */
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target as Node)
            ) {
                setMobileOpen(false);
            }
        };
        if (mobileOpen) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [mobileOpen]);

    const scrollTo = (id: string) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const NAV_LINKS: [string, string][] = [
        ["home", "Home"],
        ["what", "How It Works"],
        ["features", "Features"],
        ["about", "About"],
    ];

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

                {/* ══════════ NAVBAR ══════════ */}
                <nav className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
                    <div className="lp-nav__inner">

                        {/* Brand */}
                        <a
                            href="#home"
                            className="lp-nav__brand"
                            onClick={(e) => { e.preventDefault(); scrollTo("home"); }}
                        >
                            <div className="lp-nav__logo-wrapper">
                                <LogoIcon />
                            </div>
                            <span className="lp-nav__brand-text">TechnoBorrow</span>
                        </a>

                        {/* Center Links */}
                        <ul className="lp-nav__links">
                            {NAV_LINKS.map(([id, label]) => (
                                <li key={id}>
                                    <button
                                        className="lp-nav__link"
                                        onClick={() => scrollTo(id)}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Right Actions */}
                        <div className="lp-nav__actions">
                            <button
                                className="lp-nav__login-link"
                                onClick={() => scrollTo("cta")}
                            >
                                Login
                            </button>
                            <button
                                className="lp-btn-primary"
                                onClick={() => scrollTo("cta")}
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Hamburger */}
                        <button
                            className="lp-nav__hamburger"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            <span className="lp-nav__hamburger-bar" />
                            <span className="lp-nav__hamburger-bar" />
                            <span className="lp-nav__hamburger-bar" />
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <div
                            className="lp-nav__mobile-menu"
                            ref={mobileMenuRef}
                        >
                            {NAV_LINKS.map(([id, label]) => (
                                <button
                                    key={id}
                                    className="lp-nav__mobile-link"
                                    onClick={() => scrollTo(id)}
                                >
                                    {label}
                                </button>
                            ))}
                            <div className="lp-nav__mobile-actions">
                                <button
                                    className="lp-btn-secondary"
                                    style={{ flex: 1 }}
                                    onClick={() => scrollTo("cta")}
                                >
                                    Login
                                </button>
                                <button
                                    className="lp-btn-primary"
                                    style={{ flex: 1 }}
                                    onClick={() => scrollTo("cta")}
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    )}
                </nav>

                {/* ══════════ HERO ══════════ */}
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

                {/* ══════════ WHAT IS TECHNOBORROW ══════════ */}
                <section id="what" className="lp-section-alt">
                    <div className="lp-section-alt__inner">
                        <div className="lp-what__grid">

                            {/* Text */}
                            <div>
                                <div className="lp-section__tag">What is TechnoBorrow?</div>
                                <h2 className="lp-section__title">A Trusted Campus Borrowing System</h2>
                                <p className="lp-what__text">
                                    TechnoBorrow is a peer-to-peer equipment borrowing system developed for CIT-U
                                    students. It provides a centralized and trusted platform where students can
                                    request short-term access to academic tools, devices, and equipment directly
                                    from fellow students.
                                </p>
                                <p className="lp-what__text">
                                    The system supports the complete borrowing lifecycle:
                                </p>
                                <div className="lp-what__lifecycle">
                                    {["Request", "Offer", "Match", "Borrow", "Return"].map(
                                        (step, i, arr) => (
                                            <span key={step} className="lp-what__flow-step-wrapper">
                                                <span className="lp-what__flow-step">{step}</span>
                                                {i < arr.length - 1 && (
                                                    <span className="lp-what__flow-arrow">→</span>
                                                )}
                                            </span>
                                        )
                                    )}
                                </div>
                                <p className="lp-what__text">
                                    All transactions are tracked within the platform to ensure accountability
                                    and transparency between borrower and lender.
                                </p>
                            </div>

                            {/* Visual */}
                            <div className="lp-what__visual">
                                {[
                                    {
                                        icon: "🤝",
                                        label: "Peer-to-Peer",
                                        value: "Student Network",
                                        mod: "peer",
                                    },
                                    {
                                        icon: "🔒",
                                        label: "Secure Auth",
                                        value: "Institutional Email",
                                        mod: "auth",
                                    },
                                    {
                                        icon: "📦",
                                        label: "Borrowing",
                                        value: "Full Lifecycle Tracking",
                                        mod: "borrow",
                                    },
                                ].map((s) => (
                                    <div key={s.label} className="lp-what__stat-box">
                                        <div className={`lp-what__stat-icon lp-what__stat-icon--${s.mod}`}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <div className="lp-what__stat-label">{s.label}</div>
                                            <div className="lp-what__stat-value">{s.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════ CORE PRINCIPLES ══════════ */}
                <section className="lp-section">
                    <div className="lp-section__header--centered">
                        <div className="lp-section__tag lp-section__tag--centered">
                            Core Principles
                        </div>
                        <h2 className="lp-section__title">What Drives TechnoBorrow</h2>
                    </div>
                    <div className="lp-cards__grid">
                        {[
                            {
                                icon: "🎓",
                                title: "Student-to-Student",
                                desc: "Connect directly with verified CIT-U students using institutional email authentication. No intermediaries — just secure campus collaboration.",
                                mod: "primary",
                            },
                            {
                                icon: "🛡️",
                                title: "Secure & Accountable",
                                desc: "Borrowing transactions require confirmation from both borrower and lender. Status updates ensure clear tracking from request to return.",
                                mod: "success",
                            },
                            {
                                icon: "🏫",
                                title: "Campus-Focused",
                                desc: "Designed specifically for academic needs, supporting short-term borrowing for projects, laboratory work, exams, and coursework.",
                                mod: "gold",
                            },
                        ].map((card) => (
                            <div key={card.title} className="lp-card">
                                <div className={`lp-card__icon-wrapper lp-card__icon-wrapper--${card.mod}`}>
                                    {card.icon}
                                </div>
                                <h3 className="lp-card__title">{card.title}</h3>
                                <p className="lp-card__desc">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════ HOW IT WORKS ══════════ */}
                <section id="how-it-works" className="lp-steps__section">
                    <div className="lp-steps__inner">
                        <div className="lp-steps__header">
                            <div className="lp-section__tag lp-section__tag--centered">Process</div>
                            <h2 className="lp-section__title">How It Works</h2>
                            <p className="lp-section__subtitle lp-section__subtitle--centered">
                                Get started in three simple steps.
                            </p>
                        </div>
                        <div className="lp-steps__grid">
                            {[
                                {
                                    num: "1",
                                    icon: "✉️",
                                    title: "Register with Your Institutional Email",
                                    desc: "Create an account using your official CIT-U email address to access the platform securely.",
                                },
                                {
                                    num: "2",
                                    icon: "📋",
                                    title: "Post or Respond to Requests",
                                    desc: "Need equipment? Post a borrowing request. Have equipment to lend? Offer to fulfill a request.",
                                },
                                {
                                    num: "3",
                                    icon: "✅",
                                    title: "Confirm and Track the Transaction",
                                    desc: "Once an offer is accepted, the borrowing transaction is created and tracked. Both users confirm once the equipment is returned.",
                                },
                            ].map((step) => (
                                <div key={step.num} className="lp-step-card">
                                    <div className="lp-step-card__number">{step.num}</div>
                                    <div className="lp-step-card__icon">{step.icon}</div>
                                    <h3 className="lp-step-card__title">{step.title}</h3>
                                    <p className="lp-step-card__desc">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════ PLATFORM FEATURES ══════════ */}
                <section id="features" className="lp-section">
                    <div className="lp-section__header--centered">
                        <div className="lp-section__tag lp-section__tag--centered">
                            Platform Features
                        </div>
                        <h2 className="lp-section__title">Platform Features</h2>
                        <p className="lp-section__subtitle lp-section__subtitle--centered">
                            Everything you need for seamless campus equipment sharing.
                        </p>
                    </div>
                    <div className="lp-features__grid">
                        {[
                            {
                                icon: "📌",
                                title: "Active Requests",
                                desc: "Browse borrowing requests posted by students in real-time.",
                                mod: "maroon",
                            },
                            {
                                icon: "📝",
                                title: "Post Requests",
                                desc: "Create detailed borrowing requests including item name, purpose, and duration.",
                                mod: "gold",
                            },
                            {
                                icon: "🤝",
                                title: "Lending Offers",
                                desc: "Offer equipment in response to posted requests and connect directly with borrowers.",
                                mod: "success",
                            },
                            {
                                icon: "📊",
                                title: "Transaction Tracking",
                                desc: "Monitor borrowing status: Posted, Matched, Borrowed, Returned.",
                                mod: "maroon",
                            },
                            {
                                icon: "👤",
                                title: "User Profiles",
                                desc: "Manage your account and view your active and completed transactions.",
                                mod: "gold",
                            },
                            {
                                icon: "🔐",
                                title: "Institutional Authentication",
                                desc: "Secure login using JWT-based authentication and institutional email validation.",
                                mod: "success",
                            },
                        ].map((f) => (
                            <div key={f.title} className="lp-feature-card">
                                <div className={`lp-feature-card__icon lp-feature-card__icon--${f.mod}`}>
                                    {f.icon}
                                </div>
                                <h3 className="lp-feature-card__title">{f.title}</h3>
                                <p className="lp-feature-card__desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════ BUILT FOR STUDENTS ══════════ */}
                <section id="about" className="lp-built__section">
                    <div className="lp-built__inner">
                        <div className="lp-built__grid">

                            {/* Text */}
                            <div className="lp-built__text">
                                <div className="lp-section__tag">About the Project</div>
                                <h2 className="lp-section__title">
                                    Built for Students,<br />By Students
                                </h2>
                                <p>
                                    TechnoBorrow was developed as part of the{" "}
                                    <strong>IT342 System Integration and Architecture</strong> course to address
                                    the common challenge students face when short-term access to equipment is
                                    needed.
                                </p>
                                <p>
                                    Instead of purchasing items used only once or twice, students can borrow
                                    responsibly within the campus community.
                                </p>
                                <p>
                                    Focused on security, usability, and maintainability, TechnoBorrow provides
                                    a structured and accountable borrowing workflow for academic use.
                                </p>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h3 className="lp-built__arch-title">Three-Tier Architecture</h3>
                                <div className="lp-built__tech-stack">
                                    {[
                                        {
                                            icon: "☕",
                                            label: "Spring Boot",
                                            sub: "RESTful API Backend",
                                            mod: "spring",
                                        },
                                        {
                                            icon: "⚛️",
                                            label: "React",
                                            sub: "Web Application Frontend",
                                            mod: "react",
                                        },
                                        {
                                            icon: "🐘",
                                            label: "PostgreSQL",
                                            sub: "Relational Database",
                                            mod: "pg",
                                        },
                                    ].map((t) => (
                                        <div key={t.label} className="lp-built__tech-item">
                                            <div className={`lp-built__tech-badge lp-built__tech-badge--${t.mod}`}>
                                                {t.icon}
                                            </div>
                                            <div>
                                                <div className="lp-built__tech-label">{t.label}</div>
                                                <div className="lp-built__tech-sub">{t.sub}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="lp-built__tags">
                                    {["Security", "Usability", "Maintainability", "Accountability"].map(
                                        (tag) => (
                                            <span key={tag} className="lp-built__tag">
                                                {tag}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════ CALL TO ACTION ══════════ */}
                <section id="cta" className="lp-cta">
                    <div className="lp-cta__inner">
                        <div className="lp-cta__badge">🚀 Get Started Today</div>
                        <h2 className="lp-cta__title">Ready to Borrow or Lend Equipment?</h2>
                        <p className="lp-cta__subtext">
                            Create your account using your institutional email and start connecting with
                            fellow CIT-U students today.
                        </p>
                        <div className="lp-cta__btns">
                            <button className="lp-hero__btn-primary">Create Account</button>
                            <button className="lp-hero__btn-secondary">Sign In</button>
                        </div>
                    </div>
                </section>

                {/* ══════════ FOOTER ══════════ */}
                <footer className="lp-footer">
                    <div className="lp-footer__inner">
                        <div className="lp-footer__grid">

                            {/* Brand */}
                            <div>
                                <div className="lp-footer__logo-row">
                                    <div className="lp-footer__logo-wrapper">
                                        <LogoIcon />
                                    </div>
                                    <div className="lp-footer__brand-name">TechnoBorrow</div>
                                </div>
                                <p className="lp-footer__tagline">
                                    Empowering students to share resources within the campus community.
                                </p>
                            </div>

                            {/* Platform */}
                            <div>
                                <div className="lp-footer__col-title">Platform</div>
                                <ul className="lp-footer__links">
                                    {[
                                        "How It Works",
                                        "Browse Requests",
                                        "Post Request",
                                        "Safety Guidelines",
                                    ].map((l) => (
                                        <li key={l}>
                                            <button className="lp-footer__link">{l}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <div className="lp-footer__col-title">Support</div>
                                <ul className="lp-footer__links">
                                    {["Help Center", "Contact"].map((l) => (
                                        <li key={l}>
                                            <button className="lp-footer__link">{l}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <div className="lp-footer__col-title">Legal</div>
                                <ul className="lp-footer__links">
                                    {["Terms of Service", "Privacy Policy"].map((l) => (
                                        <li key={l}>
                                            <button className="lp-footer__link">{l}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="lp-footer__divider">
                            © 2026 TechnoBorrow – CIT-U Academic Project
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
};

export default LandingPage;
