const TECH_STACK = [
    { icon: "☕", label: "Spring Boot", sub: "RESTful API Backend", mod: "spring" },
    { icon: "⚛️", label: "React", sub: "Web Application Frontend", mod: "react" },
    { icon: "📊", label: "Supabase", sub: "Database", mod: "pg" },
];

const VALUE_TAGS = ["Security", "Usability", "Maintainability", "Accountability"];

const AboutSection = () => (
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
                        {TECH_STACK.map((t) => (
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
                        {VALUE_TAGS.map((tag) => (
                            <span key={tag} className="lp-built__tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default AboutSection;
