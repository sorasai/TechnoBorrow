interface PrincipleCardProps {
    icon: string;
    title: string;
    desc: string;
    mod: string;
}

const PrincipleCard = ({ icon, title, desc, mod }: PrincipleCardProps) => (
    <div className="lp-card">
        <div className={`lp-card__icon-wrapper lp-card__icon-wrapper--${mod}`}>
            {icon}
        </div>
        <h3 className="lp-card__title">{title}</h3>
        <p className="lp-card__desc">{desc}</p>
    </div>
);

export default PrincipleCard;
