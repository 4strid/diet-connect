const test       = require('tape')
const server     = require('diet')
const request    = require('request-promise-native')
const compatible = require('../')

/*********
 * Setup *
 *********/

const app = server()
app.listen('http://localhost:7777')

const sendware = compatible(function respondware (req, res, next) {
	res.end('test success')
})

const defineware = compatible(function defineware (req, res, next) {
	Object.defineProperty(req, 'defined', {
		value: 'defined'
	})
	next()
})

const hasware = compatible(function hasware (req, res, next) {
	req.has = 'defined' in req
	next()
})

const nativeHasware = function ($) {
	$.has = 'defined' in $
	$.return()
}

// const getware = ...
// we implicitly test get all the time

const setware = compatible(function setware (req, res, next) {
	req.set = 'set'
	next()
})

const deleteware = compatible(function deleteware (req, res, next) {
	delete req.set
	next()
})

function ErrHandler (t) {
	return function (err) {
		t.fail('this test should not throw an error: ' + err.name)
		t.end()
	}
}

/*********
 * Tests *
 *********/

test('Expect send middleware to send a response', function (t) {
	app.get('/test1', sendware)

	request('http://localhost:7777/test1')
	.then(function (res) {
		t.equal(res, 'test success', 'got the expected response')
		t.end()
	})
	.catch(ErrHandler(t))
})

test('Expect define middleware to define a property onto $', function (t) {
	app.get('/test2', defineware, function ($) {
		$.end($.defined)
	})

	request('http://localhost:7777/test2')
	.then(function (res) {
		t.equal(res, 'defined', 'property defined. got the expected response')
		t.end()
	})
	.catch(ErrHandler(t))
})

test('Expect in operator to work on middleware when called in connect style', function (t) {
	app.get('/test3', defineware, hasware, function ($) {
		$.end('' + $.has)
	})

	request('http://localhost:7777/test3')
	.then(function (res) {
		t.equal(res, 'true', 'found the property. got the expected response')
		t.end()
	})
	.catch(ErrHandler(t))
})

test('Expect in operator to work on middleware when called in diet style', function (t) {
	app.get('/test4', defineware, nativeHasware, function ($) {
		$.end('' + $.has)
	})

	request('http://localhost:7777/test4')
	.then(function (res) {
		t.equal(res, 'true', 'found the property. got the expected response')
		t.end()
	})
	.catch(ErrHandler(t))
})

test('Expect set middleware to set a property onto $', function (t) {
	app.get('/test5', setware, function ($) {
		$.end($.set)
	})

	request('http://localhost:7777/test5')
	.then(function (res) {
		t.equal(res, 'set', 'set the property. got the expected response')
		t.end()
	})
	.catch(ErrHandler(t))
})

test('Expect delete middleware to delete a property from $', function (t) {
	app.get('/test6', setware, deleteware, function ($) {
		$.end('' + $.set)
	})

	request('http://localhost:7777/test6')
	.then(function (res) {
		t.equal(res, 'undefined', 'deleted the property. got the expected response')
		t.end()
	})
	.catch(ErrHandler(t))
})


test.onFinish(function () {
	process.exit(0)
})
