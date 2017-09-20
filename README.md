# diet-connect
Compatibility layer for using Connect/Express middleware in diet apps

Use your favorite Express middleware out of the box

```javascript
const compatible = require('diet-connect')
const logger = require('morgan')
const serve = require('express-static')
...
app.header(compatible(logger('dev')))
app.header(compatible(serve(app.path + 'static')))
```

Proxies any assignment to req object by middleware to signal object ($) (by default)
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


If attaching it all to the signal is problematic, you can use safe mode to proxy to $.req object instead

```javascript
const compatible = require('diet-connect').safe

const fooware = function (req, res, next) {
	req.foo = 'bar'
	next()
}

app.header(compatible(fooware))

app.get('/', function ($) {
	$.end($.req.foo)
	// sends 'bar'
})
```

[Examples](https://github.com/cutejs/diet-connect-example)
