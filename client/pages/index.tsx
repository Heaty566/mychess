import * as React from "react";
import TextField from "../components/form/textField";
//* Import
import { seoHead } from "../helper/seoHead";

export interface IndexProps {}
export const HomePage: React.FunctionComponent<IndexProps> = () => {
        return (
                <>
                        {seoHead({ title: "Home", isIndexPage: true, isFollowPage: true, canonical: "/" })}
                        <main className="bg-gray-cus-500 w-full p-10">
                                <div className="w-96 bg-gray-600 px-8 py-16">
                                        <TextField name="username" label="Username" register={() => console.log("hello")} error="Username is taken" />
                                </div>
                        </main>
                </>
        );
};

export default HomePage;
