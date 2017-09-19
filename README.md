# diet-connect
Compatibility layer for using Connect middleware in diet apps

Use your favorite Connect middleware out of the box

```javascript
const compatible = require('diet-connect')
const logger = require('morgan')
const session = require('express-session')
...
app.header(compatible(logger('dev')))
app.header(compatible(session(options, store)))
```

Proxies any assignment to req object by middleware to signal object ($)

```javascript
const fooMiddleware = function (req, res, next) {
	req.foo = 'bar';
	next();
}

app.header(compatible(fooMiddleware))

app.get('/', function ($) {
	$.end($.foo)
	// sends 'bar'
})
```

Let me know if it doesn't work for a certain middleware.
