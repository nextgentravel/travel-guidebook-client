/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import "./src/styles/style.scss"
import React from 'react'
import { IntlProvider } from 'react-intl';

import i18nMessages from './src/data/messages';
import languages from './src/data/languages'

import { PreviewStoreProvider } from 'gatsby-source-prismic'

const getLanguageFromPath = (path, languages) => {
    if (!path) {
      return languages[0]
    }
    const langPart = path.split('/')[1]
    return languages.includes(langPart) ? langPart : languages[0]
}

export const wrapPageElement = ({ element, props }) => {
    const languageKey = getLanguageFromPath(props.location.pathname, languages.langs)
    return (
        <PreviewStoreProvider>
            <IntlProvider locale={languageKey} messages={i18nMessages[languageKey]}>
                {element}
            </IntlProvider>
        </PreviewStoreProvider>
    )
}
