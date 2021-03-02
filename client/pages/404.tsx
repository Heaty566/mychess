import * as React from "react";

//* Import
import { seoHead } from "../helper/seoHead";

export interface NotFoundProps {}
const NotFound: React.FunctionComponent<NotFoundProps> = () => {
        return (
                <>
                        {seoHead({ title: "not found", canonical: "/not-found" })}
                        <h1>tet</h1>
                </>
        );
};

export default NotFound;
