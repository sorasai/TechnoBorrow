interface StepCardProps {
    num: string;
    icon: string;
    title: string;
    desc: string;
}

const StepCard = ({ num, icon, title, desc }: StepCardProps) => (
    <div className="lp-step-card">
        <div className="lp-step-card__number">{num}</div>
        <div className="lp-step-card__icon">{icon}</div>
        <h3 className="lp-step-card__title">{title}</h3>
        <p className="lp-step-card__desc">{desc}</p>
    </div>
);

export default StepCard;
