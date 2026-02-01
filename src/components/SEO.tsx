import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO = ({
    title,
    description = "Pop Playground - ร้านหนังสือจิตวิทยาเด็กที่สนุกที่สุด! คัดสรรหนังสือดีๆ เพื่อพัฒนาการลูกน้อย",
    image = "/images/og-image.jpg",
    url = "https://pop-playground.com",
    type = "website"
}: SEOProps) => {
    const siteTitle = "Pop Playground | หนังสือเด็ก จิตวิทยา และครอบครัว";
    const finalTitle = title ? `${title} | Pop Playground` : siteTitle;
    const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{finalTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImageUrl} />
        </Helmet>
    );
};
