import React from "react"
import { Link } from "gatsby"
import Image from "../components/image"
import { FormattedMessage, useIntl } from 'react-intl';

const Footer = ({ siteTitle, homeLink }) => {
  const intl = useIntl();
  return (
    <footer className="footer">
      <div className="bg-dark py-5 footer-deco">
        <div className="container">
          <ul className="list-unstyled colcount-sm-2 colcount-md-3">
            <li>
              <a href={`${homeLink}knowledgebase`} className="text-light">
               <FormattedMessage id="knowledge" />
              </a>
            </li>
            <li>
              <a href={`${homeLink}sitemap`} className="text-light">
                <FormattedMessage id="training" />
              </a>
            </li>
            <li>
              <a href="" className="text-light">
                <FormattedMessage id="submitquestion" />
              </a>
            </li>
            <li>
              <a href="" className="text-light">
              <FormattedMessage id="contact" />
              </a>
            </li>
            <li>
              <a href="" className="text-light">
                <FormattedMessage id="nextgen" />
              </a>
            </li>
            <li>
              <a href="" className="text-light">
                <FormattedMessage id="travelcard" />
              </a>
            </li>
            <li>
              <a href="" className="text-light">
                <FormattedMessage id="travelcontacts" />
              </a>
            </li>
            <li>
              <a href="" className="text-light">
                <FormattedMessage id="advisories" />
              </a>
            </li>
            <li>
              <a href="" className="text-light">
                <FormattedMessage id="estimator" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-light py-3">
        <div className="container">
          <div className="row h-100">
            <div className="col-sm-6">
              <ul className="list-unstyled colcount-sm-2 colcount-md-2 my-auto">
                  <li className="dot">
                    <a href="">
                      <FormattedMessage id="socialmedia" />
                    </a>
                  </li>
                  <li className="dot">
                    <a href="">
                      <FormattedMessage id="mobileapp" />
                    </a>
                  </li>
                  <li className="dot">
                    <a href="">
                      <FormattedMessage id="terms" />
                    </a>
                  </li>
                  <li className="dot">
                    <a href="">
                      <FormattedMessage id="privacy" />
                    </a>
                  </li>
              </ul>
            </div>
            <div className="col-sm-6 canada-logo text-right my-auto">
              <Image
                className=""
                filename="footer-tag.svg"
                alt={ intl.formatMessage({ id: 'footer-alt' })}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
