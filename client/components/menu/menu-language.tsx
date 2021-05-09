import { languageData } from './config';
export interface NavbarLangProps {
    handleOnChangeLanguage: (data: string) => void;
}

const NavbarLang: React.FunctionComponent<NavbarLangProps> = ({ handleOnChangeLanguage }) => {
    return (
        <ul className="bg-woodsmoke">
            {languageData.map((item) => (
                <li key={item.label}>
                    <button
                        className="w-full px-4 py-2 capitalize duration-300 cursor-pointer focus:outline-none hover:bg-woodsmoke-400"
                        onClick={() => handleOnChangeLanguage(item.key)}
                    >
                        {item.label}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default NavbarLang;
