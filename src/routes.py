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

data = {
  'meta': {
    'title': 'Gpay',
    'description': 'Gpay thanks you.'
  },
  'headline': 'Congratulations to the entire Google Pay team.',
  'headline_subcopy': 'Explore the handful of moments, memories, and milestones that made 2019 quite the "spot-tacular" year.',
  # data as an object.
  'dots': {
    'dot1': {
      'id': 1,
      'color': 'blue',
      'text': 'In partnership with New York City transit, Google Pay launches on OMNY, it\'s tap-to-pay system.'
    },
    'dot2': {
      'id': 2,
      'color': 'green',
      'text': 'We announced our standalone app for merchants at Google for India, highlighting our video verification method that fastracks merchant onboarding (no more feet on the street!)'
    },
    'dot3': {
      'id': 3,
      'color': 'yellow',
      'text': 'Built directly within Google Pay, the Spot Platform provides a space for merchants to host, create, build direct relationships with users.'
    },
    'dot4': {
      'id': 4,
      'color': 'red',
      'text': 'We introduced the Jobs Spot on Google Pay to help people find entry level positions that aren’t always easily discoverable online.'
    },
    'dot5': {
      'id': 5,
      'color': 'green',
      'text': 'Google Pay hit 100m MAUs!!'
    },
    'dot6': {
      'id': 6,
      'color': 'red',
      'text': 'To celebrate Diwali, we introduced 5 unique festive stamps within the GPay app in India. In 3 weeks, 40M players played the game, making this India\'s #1 gaming app if it were standalone.'
    },
    'dot7': {
      'id': 7,
      'color': 'yellow',
      'text': 'The Yandex Taxi Campaign encouraged people paying with cash for taxis to start using Google Pay - The campaign drove 40k new MTUs within 5 days.'
    },
    'dot8': {
      'id': 8,
      'color': 'blue',
      'text': 'Closed our first deal with Citibank, and introduced Cache to the world with a Wall Street Journal article.'
    },
    'dot9': {
      'id': 9,
      'color': 'red',
      'text': 'At the Singapore FinTech Festival, GPay 3.0 came to life at the world\'s largest trade conference for financial services partners attended by 40,000 guests from 130 countries.'
    },
    'dot10': {
      'id': 10,
      'color': 'yellow',
      'text': 'In a matter of months, the app hit 1M+ merchants onboarded - with a run rate of 25K merchants/day and an annualized TPV of USD 1 Billion.'
    },
  },
  # data in an array
  'info': [
    {
      'id': 1,
      'color': 'blue',
      'text': 'In partnership with New York City transit, Google Pay launches on OMNY, it\'s tap-to-pay system.'
    },
    {
      'id': 2,
      'color': 'yellow',
      'text': 'We announced our standalone app for merchants at Google for India, highlighting our video verification method that fastracks merchant onboarding (no more feet on the street!)'
    },
    {
      'id': 3,
      'color': 'red',
      'text': 'Built directly within Google Pay, the Spot Platform provides a space for merchants to host, create, build direct relationships with users.'
    },
    {
      'id': 4,
      'color': 'green',
      'text': 'We introduced the Jobs Spot on Google Pay to help people find entry level positions that aren’t always easily discoverable online.'
    },
    {
      'id': 5,
      'color': 'red',
      'text': 'Google Pay hit 100m MAUs!!'
    },
    {
      'id': 6,
      'color': 'green',
      'text': 'To celebrate Diwali, we introduced 5 unique festive stamps within the GPay app in India. In 3 weeks, 40M players played the game, making this India\'s #1 gaming app if it were standalone.'
    },
    {
      'id': 7,
      'color': 'yellow',
      'text': 'The Yandex Taxi Campaign encouraged people paying with cash for taxis to start using Google Pay - The campaign drove 40k new MTUs within 5 days.'
    },
    {
      'id': 8,
      'color': 'red',
      'text': 'Closed our first deal with Citibank, and introduced Cache to the world with a Wall Street Journal article.'
    },
    {
      'id': 9,
      'color': 'blue',
      'text': 'At the Singapore FinTech Festival, GPay 3.0 came to life at the world\'s largest trade conference for financial services partners attended by 40,000 guests from 130 countries.'
    },
    {
      'id': 10,
      'text': 'In a matter of months, the app hit 1M+ merchants onboarded - with a run rate of 25K merchants/day and an annualized TPV of USD 1 Billion.'
    },
  ],
  'endcap': [
    {
      'title': '5B+',
      'subcopy': 'transactions per year',
      'color': 'yellow'
    },
    {
      'title': '234',
      'subcopy': 'countries and territories',
      'color': 'blue'
    },
    {
      'title': '1B+',
      'subcopy': 'tap and pay transactions per year',
      'color': 'red'
    },
    {
      'title': '130',
      'subcopy': '1st party merchants',
      'color': 'yellow'
    },
    {
      'title': '200+',
      'subcopy': 'forms of payments supported',
      'color': 'green'
    }
  ]
}

#########
######### Routes for the website.
#########

@root.route('/')
@intl.route('/')
def index():

    # At this point, results for each query are resolved.
    return flask.render_template(
        'index.jinja', data=data, vars=global_site_vars)

bracket.run()
