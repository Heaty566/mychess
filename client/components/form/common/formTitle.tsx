import * as React from "react";
import { translate, Dictionary } from "../../../helper/i18n.helper";

export interface FormTitleProps {
        label: Dictionary;
}

const FormTitle: React.FunctionComponent<FormTitleProps> = ({ label }) => {
        return <h1 className="text-3xl text-center font-bold test mb-4 capitalize text-white">{translate(label)}</h1>;
};

export default FormTitle;
