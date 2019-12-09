# gpay
Gpay visuals interactive site

Author: Herb Torres &lt;[herb.torres@byhook.com](https://moma.corp.google.com/person/herb.torres@byhook.com)&gt;


## Prerequisites
* [Python](https://www.python.org/) - 2.7
* [Google Cloud SDK](https://cloud.google.com/sdk/docs/)
* [Node](https://nodejs.org/en/) &gt;=8.4.0 &lt;9.0.0 / [npm](https://www.npmjs.com/) &gt;=5.3.0 &lt;6.0.0
    * Recommend installing with [nvm](https://github.com/creationix/nvm)


## Tech Stack
* [Bracket](https://bracket.googleplex.com) - A package of tools for building marketing websites at Google.
    * [Flask](http://flask.pocoo.org/) - A Python micro web framework for architecting sites. Provides an http server, router, template language, and basic conventions for hooking things up.
    * [Jinja2](http://jinja.pocoo.org/docs/dev/) - Backend template language, shipped with Flask.
    * [Google App Engine](https://cloud.google.com/appengine/) - Preproduction staging, hosting, and live preview of cms content.
* [KCS](http://go/kcs) - Google internal CMS for storing and localizing content.
* [Glue](https://glue-docs.appspot.com) - Brand Studio's front end UI components library which follows [Marketing Web Standard](https://standards.google/).
* [AngularJS](https://angularjs.org/) - Some Glue components depend on AngularJS.


## Quickstart

For all commands, see the [full task reference](https://bracket.googleplex.com/#task-reference).

### Dev
`npm start` or `npm run dev`

### Stage on App Engine
Pushes to an arbitrarily named version without promoting it to default.

`npm run stage <app engine version>`

### Build
`npm run build`

### Other commands
Kill all instances of Python or App Engine:

`npm run gae:kill`
