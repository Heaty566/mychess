import * as React from 'react';
import SeoHead from '../components/common/seoHead';

export interface HomeProps {}

const Home: React.SFC<HomeProps> = () => {
        React.useEffect(() => {
                console.log(process.env.SERVER_URL);
        });

        return (
                <>
                        <SeoHead title="Hello" description="he" canonical="/" />
                        <h1>213</h1>
                </>
        );
};
export default Home;
