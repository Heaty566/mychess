import Link from "next/link";
import * as React from "react";

import { translate, Dictionary } from "../../../helper/i18n.helper";

export interface BottomLinkProps {
        label: Dictionary;
        labelLink: Dictionary;
        url: string;
}

const BottomLink: React.FunctionComponent<BottomLinkProps> = ({ label, labelLink, url }) => {
        return (
                <div className="mt-6 text-center">
                        <p className="text-white text-sm font-thin capitalize-first">
                                {translate(label) + "?"}
                                <Link href={url}>
                                        <a className="font-medium ml-1 hover:text-indigo-200 capitalize duration-300">{translate(labelLink)}</a>
                                </Link>
                        </p>
                </div>
        );
};

export default BottomLink;
