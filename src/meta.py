"""Defines the site configuration data on a variable named `meta`.

The meta object should contain at a minimum define one key `pages`:

meta = {
  'pages': {
    '/': {
      'description': 'This is the index page description.'
    },
    '/hello/': {
      'descriptions': 'This is the hello page description.'
    }
  }
}

The value of each url key in `meta.page` will be assigned to the `g.meta` flask
variable during the page render. For instance, the above will make
{{g.meta.description}} in a template render to "This is the index page
description."

WARNING: Declaring module level variables (e.g. paths, pages) that vary across
KCS workspaces, causes concurrency issues.

"""

# Locales for the site.
locales = [
]


def _get_paths():
  """Returns non-intl paths for the site."""
  paths = [
      '/'
  ]
  return paths


def _get_pages():
  """Returns all the site pages."""
  pages = {}

  # Create the root pages.
  for path in _get_paths():
    pages[path] = {}

  # Create the intl pages.
  for locale in locales:
    for path in _get_paths():
      pages[('/intl/' + locale + path)] = {}

  return pages


def get_meta():
  """Returns the meta object."""
  meta = {
      'pages': _get_pages()
  }
  return meta
