import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Link } from "gatsby"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12" lang="fr">
            <h2>Nous ne pouvons trouver cette page (Erreur 404)</h2>
            <p>Nous sommes désolés que vous ayez abouti ici. Il arrive parfois qu'une page ait été déplacée ou supprimée. Heureusement, nous pouvons vous aider à trouver ce que vous cherchez.</p>
            <Link to="/fr">Return to the home page</Link>
          </div>
          <div className="col-lg-6 col-md-12" lang="en">
            <h2>We couldn't find that page (Error 404)</h2>
            <p>We're sorry you ended up here. Sometimes a page gets moved or deleted, but hopefully we can help you find what you're looking for.</p>
            <Link to="/en">Return to the home page</Link>
          </div>
        </div>
      </div>
    </Layout>
)

export default NotFoundPage
