import { useState, useEffect, useRef } from "react";
import LogoIcon from "./LogoIcon";

const NAV_LINKS: [string, string][] = [
    ["home", "Home"],
    ["what", "How It Works"],
    ["features", "Features"],
    ["about", "About"],
];

interface NavSectionProps {
    scrollTo: (id: string) => void;
}

const NavSection = ({ scrollTo }: NavSectionProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    const handleNavScroll = (id: string) => {
        setMobileOpen(false);
        scrollTo(id);
    };

    return (
        <nav className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
            <div className="lp-nav__inner">

                {/* Brand */}
                <a
                    href="#home"
                    className="lp-nav__brand"
                    onClick={(e) => { e.preventDefault(); handleNavScroll("home"); }}
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
                                onClick={() => handleNavScroll(id)}
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
                <div className="lp-nav__mobile-menu" ref={mobileMenuRef}>
                    {NAV_LINKS.map(([id, label]) => (
                        <button
                            key={id}
                            className="lp-nav__mobile-link"
                            onClick={() => handleNavScroll(id)}
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
    );
};

export default NavSection;
