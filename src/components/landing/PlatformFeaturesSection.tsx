import FeatureCard from "./FeatureCard";

const FEATURES = [
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
];

const PlatformFeaturesSection = () => (
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
            {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
            ))}
        </div>
    </section>
);

export default PlatformFeaturesSection;
