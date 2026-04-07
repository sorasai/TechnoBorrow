interface FeatureCardProps {
    icon: string;
    title: string;
    desc: string;
    mod: string;
}

const FeatureCard = ({ icon, title, desc, mod }: FeatureCardProps) => (
    <div className="lp-feature-card">
        <div className={`lp-feature-card__icon lp-feature-card__icon--${mod}`}>
            {icon}
        </div>
        <h3 className="lp-feature-card__title">{title}</h3>
        <p className="lp-feature-card__desc">{desc}</p>
    </div>
);

export default FeatureCard;
