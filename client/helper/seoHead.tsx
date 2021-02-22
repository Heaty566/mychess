import * as React from 'react';
import Head from 'next/head';

export interface HeadProps {
        title: string;
        description?: string;
        isIndexPage?: boolean;
        isFollowPage?: boolean;
        canonical: string;
        keyword?: string;
        imageUrl?: string;
}

export const seoHead = ({
        title = 'MyQuiz',
        isIndexPage = false,
        isFollowPage = true,
        description = 'My Quiz is an awesome platform to make Your Awesome Quiz And Become Your Most Unstoppable Self',
        canonical = '/',
        keyword = 'myquiz, quiz, exam, study, learning',
        imageUrl = '/asset/share/banner.png',
}: HeadProps) => {
        const metaIndexPage = isIndexPage ? 'index' : 'noindex';
        const metaIsFollowPage = isFollowPage ? 'follow' : 'nofollow';
        const metaRobots = `${metaIndexPage},${metaIsFollowPage}`;
        const canonicalLink = process.env.DOMAIN + canonical;
        const pageTitle = title === 'Home' ? 'MyQuiz' : `${title} | MyQuiz`;

        return (
                <Head>
                        <meta charSet="UTF-8" />
                        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />
                        <meta name="google-site-verification" content="BWOjVaLMrQlDDZSMNRtScpbtQTBOWSuuZLoFe6IwjV4" />
                        {/* common header */}
                        <title>{pageTitle}</title>
                        <meta name="description" content={description} />
                        <meta name="robots" content={metaRobots} />
                        <meta name="keywords" content={keyword} />
                        <link href={canonicalLink} rel="canonical" />
                        {/* google header */}
                        <meta property="og:type" content="article" />
                        <meta property="og:title" content={pageTitle} />
                        <meta property="og:description" content={description} />
                        <meta property="og:image" content={imageUrl} />
                        <meta property="fb:app_id" content={process.env.FB_APP_ID} />
                        {/* twitter header */}
                        <meta name="twitter:title" content={pageTitle} />
                        <meta name="twitter:description" content={description} />
                        <meta name="twitter:image" content={imageUrl} />
                        <meta name="twitter:card" content="summary_large_image" />
                </Head>
        );
};
