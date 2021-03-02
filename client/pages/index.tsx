import * as React from "react";
import TextField from "../components/form/textField";
//* Import
import { seoHead } from "../helper/seoHead";

export interface IndexProps {}
export const HomePage: React.FunctionComponent<IndexProps> = () => {
        return (
                <>
                        {seoHead({ title: "Home", isIndexPage: true, isFollowPage: true, canonical: "/" })}
                        <main className="bg-gray-cus-500 w-full p-10"></main>
                </>
        );
};

export default HomePage;
