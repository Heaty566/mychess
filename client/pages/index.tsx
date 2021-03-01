import * as React from "react";

//* Import
import { seoHead } from "../helper/seoHead";

export interface IndexProps {}
export const HomePage: React.FunctionComponent<IndexProps> = () => {
        return (
                <>
                        {seoHead({ title: "Home", isIndexPage: true, isFollowPage: true, canonical: "/" })}
                        <main>
                                <h1></h1>
                        </main>
                </>
        );
};

export default HomePage;
