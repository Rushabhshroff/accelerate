/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { Helmet } from "react-helmet"



export function SEO(props: SEOProps) {
    const metaDescription = props.description || ''
    const defaultTitle = props.title || ''
    const meta = props.meta || []
    return (
        <Helmet
            htmlAttributes={{
                lang: props.lang,
            }}
            title={props.title}
            titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : undefined}
            meta={[
                {
                    name: `description`,
                    content: metaDescription,
                },
                {
                    property: `og:title`,
                    content: props.title,
                },
                {
                    property: `og:description`,
                    content: metaDescription,
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
                {
                    name: `twitter:card`,
                    content: `summary`,
                },
                {
                    name: `twitter:creator`,
                    content: ``,
                },
                {
                    name: `twitter:title`,
                    content: props.title,
                },
                {
                    name: `twitter:description`,
                    content: metaDescription,
                },
                ...meta
            ]}
        />
    )
}


type SEOProps = {
    description?: string,
    lang?: string,
    meta?: React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>[],
    title: string,
}

export default SEO