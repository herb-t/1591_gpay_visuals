# encoding=utf8
"""Route declarations for the Bracket site."""

# bracket is the package that instantiates and configures the the flask app with
# boilerplate logic for auth, intl routes, and static file serving stuff.
#
# intl:     Flask blueprint for intl routes.
# kcs:      Wrapper for the kcs rest api.
# root:     Flask blueprint for root routes.
import bracket
from bracket import intl
from bracket import kcs
from bracket import root
import flask

global_site_vars = {
    'glue_version': 'v22_0'
}

#########
######### Routes for the website.
#########

@root.route('/')
@intl.route('/')
def index():
    """Showcase Web Standard"""

    # This content would typically come from Kintaro.
    content = {
        'title': 'Web Standard Scaffold',
        'resources_heading': 'Glue Resources',
        'web_standard_intro': u'Lots of people create different websites for Google, and that’s awesome. What’s a little less awesome is that it can be tricky to keep things visually and experientially consistent across them all.',
        'web_standard_is': u'Web Standard was created to make it easier for PMMs, designers, developers, and partners to build and maintain sites for Google. It’s a foundational framework, that includes design guidelines and a component library for Google marketing sites. The framework and components can be combined to build product marketing, brand communications, and initiative sites.',
        'breakpoint_is': 'Glue says your breakpoint is',
        'modal_link': 'Open a modal',
        'modal_close': 'Close Dialog',
        'previous': 'Previous',
        'next': 'Next',
        'modal_doc': 'Web Standard Modal Documentation',
        'nav': [
            {
                'label': 'Overview',
                'url': '/'
            },
            {
                'label': 'Page',
                'url': 'https://glue-docs.appspot.com/docs/components/page/'
            },
            {
                'label': 'Header',
                'url': 'https://glue-docs.appspot.com/docs/components/header/'
            },
            {
                'label': 'Footer',
                'url': 'https://glue-docs.appspot.com/docs/components/footer/'
            },
            {
                'label': 'Tiles',
                'url': 'https://glue-docs.appspot.com/docs/components/tiles/'
            },

        ],
        'carousel': [
            {
                'id': 'cool',
                'label': unicode('\U0001f64b Yup \U0001f64b', 'unicode_escape')
            },
            {
                'id': 'mmk',
                'label': unicode('\U0001f64d Mmmk \U0001f64d', 'unicode_escape')
            },
            {
                'id': 'heckyes',
                'label': unicode('\U0001f3c4 Heck Yes! \U0001f3c4', 'unicode_escape')
            },
        ],
        'tiles': [
            {
                'title': 'Glue Docs Site',
                'image': 'kittens.jpg',
                'link': 'https://glue-docs.appspot.com/',
                'description': 'go/glue'
            },
            {
                'title': 'Glue Dev Group',
                'image': 'space-kittens.jpg',
                'link': 'https://groups.google.com/a/google.com/forum/#!forum/glue-dev',
                'description': 'go/glue-dev'
            },
            {
                'title': 'Glue Forum',
                'image': 'computer-cat.jpg',
                'link': 'https://groups.google.com/a/google.com/forum/#!forum/glue-discuss',
                'description': 'groups/glue-discuss'
            },
        ],
        'tabby': [
            {
                'id': 'glue',
                'title': 'Glue',
                'content': u'Glue is Brand Studio’s Javascript component, utility, and pattern library written in Closure and AngularJS. It differs from other component libraries in that it has broader browser compatibility and uses progressive enhancement to ensure even non-js users and older browsers can still access the content.',
            },
            {
                'id': 'web-standard',
                'title': 'Web Standard',
                'content': u'Marketing Web Standard was created to make it easier for PMMs, designers, developers, and partners to build and maintain sites for Google. It’s a foundational framework that includes design guidelines and a component library for Google marketing sites. The framework and components can be combined to build product marketing, brand communications, and initiative sites.',
            },
        ],
    }

    # At this point, results for each query are resolved.
    return flask.render_template(
        'index.jinja', content=content, vars=global_site_vars)

bracket.run()
