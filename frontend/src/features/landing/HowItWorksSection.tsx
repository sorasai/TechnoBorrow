import StepCard from "./StepCard";

const STEPS = [
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
];

const HowItWorksSection = () => (
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
                {STEPS.map((step) => (
                    <StepCard key={step.num} {...step} />
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorksSection;
