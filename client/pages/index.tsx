import * as React from 'react';
import SeoHead from '../components/common/seoHead';

export interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = () => (
    <>
        <SeoHead title="Hello" description="he" canonical="/" />
        <h1>213</h1>
    </>
);

export default Home;
