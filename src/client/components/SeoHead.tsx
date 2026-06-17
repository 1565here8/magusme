import { Helmet } from "react-helmet-async";

const SITE_NAME = "MagusMe";
const SITE_URL = "https://magusme.com";
const DEFAULT_DESC = "The Vault of Everything Occult. 63+ verified spells, 81 divination systems, AI-powered readings, and no censorship. Tarot, runes, astrology, grimoire, and manifestation.";
const DEFAULT_IMAGE = "/og-image.png";

export function SeoHead(props: {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  noindex?: boolean;
}) {
  const fullTitle = props.title.includes(SITE_NAME) ? props.title : `${props.title} · ${SITE_NAME}`;
  const desc = props.description ?? DEFAULT_DESC;
  const image = props.image ?? DEFAULT_IMAGE;
  const url = props.path ? `${SITE_URL}${props.path}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {props.noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
}
