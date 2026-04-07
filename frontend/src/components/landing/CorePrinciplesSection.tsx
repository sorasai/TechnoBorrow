import PrincipleCard from "./PrincipleCard";

const PRINCIPLES = [
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
];

const CorePrinciplesSection = () => (
    <section className="lp-section">
        <div className="lp-section__header--centered">
            <div className="lp-section__tag lp-section__tag--centered">
                Core Principles
            </div>
            <h2 className="lp-section__title">What Drives TechnoBorrow</h2>
        </div>
        <div className="lp-cards__grid">
            {PRINCIPLES.map((card) => (
                <PrincipleCard key={card.title} {...card} />
            ))}
        </div>
    </section>
);

export default CorePrinciplesSection;
