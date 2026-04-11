import logo from "../../shared/assets/TechnoBorrow_logo.png";

const LogoIcon = () => (
    <img
        src={logo}
        alt="TechnoBorrow logo"
        width={40}
        height={40}
        style={{ objectFit: "contain", display: "block", background: "white" }}
    />
);

export default LogoIcon;
