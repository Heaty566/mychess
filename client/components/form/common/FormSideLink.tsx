import Link from "next/link";
import * as React from "react";
import { Dictionary, translate } from "../../../helper/i18n.helper";

export interface FormSideLinkProps {
        url: string;
        label: Dictionary;
}

const FormSideLink: React.FunctionComponent<FormSideLinkProps> = ({ label, url }) => {
        return (
                <Link href={url}>
                        <a className="text-white text-sm font-thin capitalize hover:text-indigo-200  duration-300">
                                {translate({ content: label }) + "?"}
                        </a>
                </Link>
        );
};

export default FormSideLink;
