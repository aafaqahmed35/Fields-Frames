import { defineQuery } from "next-sanity";

export const ARTICLE_QUERY = defineQuery(`
  *[
    _type == "article" &&
    section == $section &&
    slug.current == $slug &&
    defined(publishedAt)
  ][0]{
    _id,
    title,
    "slug": slug.current,
    section,
    category,
    mode,
    dek,
    kicker,
    opening,
    publishedAt,
    readingTimeOverride,
    leadImage{
      asset->{_id, _type, url, metadata{dimensions{width, height, aspectRatio}}},
      crop,
      hotspot,
      alt,
      caption,
      credit
    },
    body[]{
      ...,
      _type == "articleFigure" => {
        _type,
        image{
          asset->{_id, _type, url, metadata{dimensions{width, height, aspectRatio}}},
          crop,
          hotspot,
          alt,
          caption,
          credit
        }
      }
    },
    author->{_id, name, "slug": slug.current, bio},
    relatedArticles[]->{
      _id,
      title,
      "slug": slug.current,
      section,
      category,
      dek,
      publishedAt,
      "author": author->name,
      leadImage{
        asset->{_id, _type, url, metadata{dimensions{width, height, aspectRatio}}},
        crop,
        hotspot,
        alt,
        caption,
        credit
      }
    },
    seo{
      title,
      description,
      socialImage{
        asset->{_id, _type, url, metadata{dimensions{width, height, aspectRatio}}},
        crop,
        hotspot,
        alt,
        caption,
        credit
      }
    }
  }
`);

export const ARTICLE_SLUGS_QUERY = defineQuery(`
  *[
    _type == "article" &&
    section == $section &&
    defined(slug.current) &&
    defined(publishedAt) &&
    defined(title) &&
    defined(dek) &&
    defined(category) &&
    defined(mode) &&
    defined(body[0]) &&
    defined(author->._id)
  ] | order(slug.current asc) {
    "slug": slug.current
  }
`);

export const ARTICLE_SUMMARIES_QUERY = defineQuery(`
  *[
    _type == "article" &&
    section == $section &&
    defined(slug.current) &&
    defined(publishedAt)
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    section,
    category,
    dek,
    publishedAt,
    "author": author->name,
    leadImage{
      asset->{_id, _type, url, metadata{dimensions{width, height, aspectRatio}}},
      crop,
      hotspot,
      alt,
      caption,
      credit
    }
  }
`);
