import React from "react";
import { graphql } from 'gatsby'
import Layout from "../components/layout"
import Breadcrumbs from "../components/breadcrumb"
import SEO from "../components/seo"

import { getCurrentLangKey } from 'ptz-i18n';
import 'intl';
import { globalHistory } from "@reach/router"

export default ({ data }) => {
  const post = data.markdownRemark;
  const url = globalHistory.location.pathname;
  const { langs, defaultLangKey } = data.site.siteMetadata.languages;
  const langKey = getCurrentLangKey(langs, defaultLangKey, url);
  const homeLink = `/${langKey}/`;
  return (
    <Layout>
        <main>
          <SEO title={post.frontmatter.title} />
          <Breadcrumbs pageTitle={post.frontmatter.title} homeLink={homeLink} />
          <div className="hero-holder">
            <div className="container">
              <h2 className="display-5">{post.frontmatter.heading}</h2>
              <p className="lead">
                {post.frontmatter.lead}
              </p>
            </div>
          </div>
          <div className="container">
            <div
              className="row"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </main>
    </Layout>
  );
};

export const query = graphql`
  query PageQuery($slug: String!) {
    site {
      siteMetadata {
        languages {
          defaultLangKey
          langs
        }      
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        heading
        lead
      }
    }
  }
`;