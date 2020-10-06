import React from "react";
import Layout from "../components/layout"
import SEO from "../components/seo";
import ContentPanel from "../components/content-panel";
import DoormatPanel from "../components/doormat-panel";
import ToolPanel from "../components/tool-panel";
import { FormattedMessage } from 'react-intl';

const HomeLayout = () => {
    return (
        <Layout>
        <SEO title="Home" />
        <w-screen mt-4="true" fluid="true" id="container">
          <div>
            <main id="main-content" role="main">
              <div className="container mt-4">
                <h2 className="text-center mb-4 font-weight-bold"><FormattedMessage id="indexTitle" /></h2>
                <p className="text-center mb-5"><FormattedMessage id="indexLead"/></p>
                <div className="row mb-3 mt-3">
                  <ContentPanel />
                </div>
              </div>
              <div>
                <div className="container">
                  <DoormatPanel />
                </div>
              </div>
              <div className="bg-light">
                <div className="container">
                  <ToolPanel />
                </div>
              </div>
            </main>
          </div>
        </w-screen>
      </Layout>
    )
}

export default HomeLayout
