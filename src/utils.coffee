get_function = (obj, name) ->
	fnc = obj[name]
	if fnc? then fnc else () ->

change_function = ( obj, name, chain, number=1) ->
	obj[name] = (attrs...) ->
		val = ( el.apply( obj, attrs ) for el in chain )
		return val[ number ]

@Before = ( obj, func, callback ) ->
	old_fnc = get_function( obj, func )
	change_function( obj, func, [ callback, old_fnc ] )
	true

@BeforeAnyCallback = (obj, func, callback) ->
	console.warn( "TODO" )

@After = ( obj, func, callback ) ->
	old_fnc = get_function( obj, func )
	change_function( obj, func, [old_fnc, callback], 0 )
	true

@Around = (obj, func, before, after) ->
	old_fnc = get_function( obj, func )
	change_function( obj, func, [before, old_fnc, after] )
	true

@AfterAll = (obj, funcs, callback) ->
	for func in funcs
		After(obj, func, callback)

@LogAll = (object) ->
	for own key, value of object
		if value.call?
			do (key) ->
				Before(object, key, -> console.log("calling: #{key}"))

@AutoBind = (gui, useCase) ->
	for key, value of gui
		if value.call?
			do (key) ->
				name = /(.*)Clicked/.exec( key )[1]
				if name? and useCase[name]
					After(gui, key, (args) -> useCase[name](args))

