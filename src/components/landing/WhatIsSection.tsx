import React from "react";

const LIFECYCLE_STEPS = ["Request", "Offer", "Match", "Borrow", "Return"];

const STAT_BOXES = [
    { icon: "🤝", label: "Peer-to-Peer", value: "Student Network", mod: "peer" },
    { icon: "🔒", label: "Secure Auth", value: "Institutional Email", mod: "auth" },
    { icon: "📦", label: "Borrowing", value: "Full Lifecycle Tracking", mod: "borrow" },
];

const WhatIsSection = () => (
    <section id="what" className="lp-section">
        <div className="lp-section">
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
                        {LIFECYCLE_STEPS.map((step, i, arr) => (
                            <span key={step} className="lp-what__flow-step-wrapper">
                                <span className="lp-what__flow-step">{step}</span>
                                {i < arr.length - 1 && (
                                    <span className="lp-what__flow-arrow">→</span>
                                )}
                            </span>
                        ))}
                    </div>
                    <p className="lp-what__text">
                        All transactions are tracked within the platform to ensure accountability
                        and transparency between borrower and lender.
                    </p>
                </div>

                {/* Visual */}
                <div className="lp-what__visual">
                    {STAT_BOXES.map((s) => (
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
);

export default WhatIsSection;
