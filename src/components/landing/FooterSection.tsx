import LogoIcon from "./LogoIcon";

const PLATFORM_LINKS = [
    "How It Works",
    "Browse Requests",
    "Post Request",
    "Safety Guidelines",
];

const SUPPORT_LINKS = ["Help Center", "Contact"];

const LEGAL_LINKS = ["Terms of Service", "Privacy Policy"];

const FooterSection = () => (
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
                        {PLATFORM_LINKS.map((l) => (
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
                        {SUPPORT_LINKS.map((l) => (
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
                        {LEGAL_LINKS.map((l) => (
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
);

export default FooterSection;
