import Image from "next/image";
import Link from "next/link";

import { getAuthor } from "@/content/authors";
import {
  getRelatedArticles,
  type Article,
  type EditorialBodyBlock,
} from "@/content/articles";
import { sectionRoutes } from "@/content/story";

import styles from "./article-page.module.css";

function ArticleFigure({ block }: { block: Extract<EditorialBodyBlock, { type: "figure" }> }) {
  const { image } = block;

  return (
    <figure className={styles.bodyFigure}>
      <div className={styles.bodyImageFrame}>
        <Image
          className={styles.bodyImage}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 767px) 100vw, (max-width: 1100px) 78vw, 920px"
          style={{ objectPosition: image.focalPoint }}
        />
      </div>
      <figcaption>
        {image.caption ? <span>{image.caption}</span> : null}
        <span>{image.credit}</span>
      </figcaption>
    </figure>
  );
}

function BodyBlock({ block }: { block: EditorialBodyBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "heading":
      return block.level === 2 ? <h2>{block.text}</h2> : <h3>{block.text}</h3>;
    case "pullQuote":
      return (
        <blockquote className={styles.pullQuote}>
          <p>{block.text}</p>
          {block.attribution ? <cite>{block.attribution}</cite> : null}
        </blockquote>
      );
    case "figure":
      return <ArticleFigure block={block} />;
    case "list": {
      const items = block.items.map((item) => <li key={item}>{item}</li>);
      return block.style === "ordered" ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "divider":
      return <hr />;
    case "note":
      return (
        <aside className={styles.bodyNote} aria-label={block.label ?? "Article note"}>
          {block.label ? <p className={styles.noteLabel}>{block.label}</p> : null}
          <p>{block.text}</p>
        </aside>
      );
  }
}

function ArticleStructuredData({ article }: { article: Article }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    datePublished: article.date,
    articleSection: article.section,
    author: {
      "@type": "Person",
      name: article.author,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function ArticlePage({ article }: { article: Article }) {
  const author = getAuthor(article.author);
  const related = getRelatedArticles(article);
  const sectionHref = sectionRoutes[article.section];

  return (
    <div
      className={styles.articlePage}
      data-mode={article.mode.toLowerCase()}
      data-section={article.section.toLowerCase()}
    >
      <ArticleStructuredData article={article} />
      <article className={styles.article}>
        <header className={`editorial-container-wide ${styles.header}`}>
          <div className={styles.orientation}>
            <Link href={sectionHref}>← Back to {article.section}</Link>
            <span>{article.category}</span>
          </div>

          <div className={styles.headerGrid}>
            <div className={styles.headingGroup}>
              {article.kicker ? <p className={styles.kicker}>{article.kicker}</p> : null}
              <h1>{article.title}</h1>
              <p className={styles.dek}>{article.dek}</p>
            </div>

            <dl className={styles.articleMeta}>
              <div>
                <dt>Words</dt>
                <dd>By {article.author}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>
                  <time dateTime={article.date}>{article.dateLabel}</time>
                </dd>
              </div>
              <div>
                <dt>Reading time</dt>
                <dd>{article.readingMinutes} min read</dd>
              </div>
            </dl>
          </div>

          {article.mode === "FEATURE" && article.image ? (
            <figure className={styles.heroFigure}>
              <div className={styles.heroFrame}>
                <Image
                  className={styles.heroImage}
                  src={article.image.src}
                  alt={article.image.alt}
                  width={article.image.width}
                  height={article.image.height}
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) 94vw, 1504px"
                  style={{ objectPosition: article.image.focalPoint }}
                  priority
                />
              </div>
              <figcaption>
                {article.image.caption ? <span>{article.image.caption}</span> : null}
                <span>{article.image.credit}</span>
              </figcaption>
            </figure>
          ) : null}
        </header>

        <div className={`editorial-container ${styles.readingLayout}`}>
          <aside className={styles.marginNote} aria-label="Article context">
            <span>{article.section}</span>
            <span>{article.category}</span>
            <span>{article.mode.toLowerCase()}</span>
          </aside>

          <div className={styles.readingColumn}>
            {article.opening ? <p className={styles.opening}>{article.opening}</p> : null}
            <div className={styles.body}>
              {article.body.map((block, index) => (
                <BodyBlock block={block} key={`${block.type}-${index}`} />
              ))}
            </div>
          </div>
        </div>

        <footer className={`editorial-container ${styles.articleFooter}`}>
          <section className={styles.contributor} aria-labelledby="contributor-title">
            <p className={styles.footerLabel}>Contributor</p>
            <h2 id="contributor-title">{author.name}</h2>
            <p>{author.bio}</p>
          </section>

          <section className={styles.related} aria-labelledby="related-title">
            <div className={styles.relatedHeading}>
              <p className={styles.footerLabel}>Continue reading</p>
              <h2 id="related-title">Related stories</h2>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((story) => (
                <article className={styles.relatedStory} key={`${story.section}-${story.slug}`}>
                  <p>
                    {story.section} <span aria-hidden="true">/</span> {story.category}
                  </p>
                  <h3>
                    <Link href={`${sectionRoutes[story.section]}/${story.slug}`}>
                      {story.title}
                    </Link>
                  </h3>
                  <p className={styles.relatedDek}>{story.dek}</p>
                </article>
              ))}
            </div>
          </section>

          <Link className={styles.sectionReturn} href={sectionHref}>
            <span>Return to</span>
            <strong>{article.section}</strong>
            <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </article>
    </div>
  );
}
