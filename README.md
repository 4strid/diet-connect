# diet-connect
Compatibility layer for using Connect/Express middleware in diet.js apps

Use your favorite Express middleware out of the box

```javascript
const compatible = require('diet-connect')
const logger = require('morgan')
const serve = require('express-static')
...
app.header(compatible(logger('dev')))
app.footer(compatible(serve(app.path + 'static')))
```

Proxies any assignment to req object by middleware to the signal object ($).
For example, using express session usually adds .session to req; here it's attached to $

```javascript
const session = require('express-session')
app.header(compatible(session(options)))

app.get('/counter', function ($) {
	$.session.views = $.session.views || 0
	$.session.views++
	$.end('you have viewed this page ' + $.session.views + ' times')
})
// refresh the page to see the counter go up
```

[Examples](https://github.com/cutejs/diet-connect-example)

Contact
-------
Bug reports, feature requests, and questions are all welcome: open a GitHub issue and I'll get
back to you.

This is *especially true if a certain piece of middleware doesn't work*. Please open an issue
and I'll see what we need to do to get compatibility.
