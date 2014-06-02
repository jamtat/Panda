var $ = function(id) {
		return document.getElementById(id)
	},
	data = function(el, prop, val) {
		el.dataset[prop] = val
	},
	width = function(el) {
		return el.clientWidth
	},
	height = function(el) {
		return el.clientHeight
	},
	random = function(min, max) {
		return Math.random()*(max-min)+min
	},
	require = function(url, callback) {
		var s = document.createElement('script')
		s.onload = function() {
			console.log('loaded '+url)
			callback()
		}
		s.src = url
		document.body.appendChild(s)
	},
	merge = function(obj1, obj2) {
		var obj3 = {};
		for (var attrname in obj1) { obj3[attrname] = obj1[attrname] }
		for (var attrname in obj2) { obj3[attrname] = obj2[attrname] }
		return obj3;
	},
	copy = function(obj) {
		return merge({}, obj)	
	},
	isset = function(obj, undefined) {
		return obj !== undefined && obj !== null
	},
	stop = function(e) {
		e.stopPropagation()
		e.preventDefault()
	},
	timestamp = function() {
		return new Date().getTime()
	},
	hexToRgb = function(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	},
	rgbToHex = function(r, g, b) {
		function componentToHex(c) {
			var hex = c.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
		}

		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	},
	fx = [
		'jamparticles.js',
		'solid.js',
		'gradient.js'
	],
	uicontrols = [
		'sectionTitle.js',
		'pandaNumber.js',
		'pandaColour.js'
	]

app = {
	init: function() {
		this.loading.loadFiles(function() {
			this.stage.canvas = $('stage')
			this.stage.ctx = this.stage.canvas.getContext('2d')
			this.stage.setup()
			this.ui.setup()
			this.ui.update()
			this.fx.addToStage('solid')
			this.fx.addToStage('gradient')
			this.fx.addToStage('solid')
		}.bind(this))
	},
	
	loading: {
		loadCount: 0,
		toLoad: [],
		loadingComplete: false,
		loadedCallback: null,
		loadFiles: function(callback) {
			this.loadedCallback = callback
			this.loadFx()
			this.loadUi()
		},
		loadFile: function(file) {
			this.toLoad.push(file)
			this.loadCount++
			require(file, function(){
				this.fileLoaded(file)
			}.bind(this))
		},
		fileLoaded: function(file) {
			var i = this.toLoad.indexOf(file)
			if(i > -1) {
				this.toLoad.splice(i,1)
				console.log(this.loadCount-this.toLoad.length+'/'+this.loadCount+' loaded')
			}
			if(this.toLoad.length === 0) {
				this.loadedCallback()
			}
		},
		loadFx: function(callback) {
			for(effect in fx) {
				if(fx.hasOwnProperty(effect)) {
					this.loadFile('fx/'+fx[effect])
				}
			}
		},
		loadUi: function() {
			for(control in uicontrols) {
				if(uicontrols.hasOwnProperty(control)) {
					this.loadFile('ui/'+uicontrols[control])
				}
			}
		}
	},
	
	ui: {
		setup: function() {
			this.el.fxPanel = $('fx-controls')
		},
		el: {},
		loadControl: function(control) {
			this.controls[control.name] = control
		},
		controls: {},
		update: function() {
			app.stage.ui.update()
		},
		activeControls: [],
		
		renderControlsForEffect: function(effect) {
// 			this.el.fxPanel.innerHTML = ''
			var effectControlsContainer = this.template('fx-main', {name: effect.label || effect.name})
			this.activeControls = []
			effectControlsContainer.appendChild(this.recursiveControlRender(effect.controls, effect))
			effectControlsContainer.dataset.uid = effect.uid
			var self = this
			//Bind dragging
			var header = effectControlsContainer.children[0],
				startY = 0,
				startTop = 0,
				startIndex = -1,
				thresholds = [],
				downHandler = function(e) {
					var w = effectControlsContainer.offsetWidth,
						h = effectControlsContainer.offsetHeight,
						rect = effectControlsContainer.getBoundingClientRect()
					startIndex = app.stage.indexOfEffect(effect.uid)
					startY = e.clientY
					startTop = rect.top
					stop(e)
					console.log(w,h,rect, startIndex)
					
					//Get the thresholds
					var c = this.el.fxPanel.children,
						r
					thresholds = []
					for(var i = 0; i < c.length; i++) {
						r = c[i].getBoundingClientRect()
						thresholds.push(r.top + r.height)
					}
					
					//Make the shadow box
					var tempBox = document.createElement('div')
					tempBox.className = 'fx-placeholder'
					tempBox.style.height = h+'px'
					this.el.fxPanel.insertBefore(tempBox, effectControlsContainer)
					
					//Style the current box
					effectControlsContainer.classList.add('dragging')
					effectControlsContainer.style.top = rect.top+'px'
					effectControlsContainer.style.left = rect.left+'px'
					effectControlsContainer.style.width = rect.width+'px'
					effectControlsContainer.style.height = rect.height+'px'
					
					//Bind other handlers
					document.addEventListener('mouseup', upHandler)
					document.addEventListener('mousemove', moveHandler)
					
				}.bind(this),
				moveHandler = function(e) {
					stop(e)
					var y = e.clientY,
						dy = y - startTop
					effectControlsContainer.style.top = startTop+dy+'px'
				}.bind(this),
				upHandler = function(e) {
					stop(e)
					var y = e.clientY,
						ind = thresholds.length
						
					for(var i = 0; i < thresholds.length; i++) {
						if(y < thresholds[i]) {
							ind = i
							break
						}
					}
					
					document.removeEventListener('mouseup', upHandler)
					document.removeEventListener('mousemove', moveHandler)
					
					effectControlsContainer.classList.remove('dragging')
					effectControlsContainer.style.top = ''
					effectControlsContainer.style.left = ''
					effectControlsContainer.style.width = ''
					effectControlsContainer.style.height = ''
					
					this.el.fxPanel.removeChild(effectControlsContainer)
					
					this.el.fxPanel.removeChild(this.el.fxPanel.querySelector('.fx-placeholder'))
					//Insert the element back into the right place
					if(ind === thresholds.length) {
						this.el.fxPanel.appendChild(effectControlsContainer)
					} else {
						this.el.fxPanel.insertBefore(effectControlsContainer, this.el.fxPanel.children[ind])
					}
					
					//Insert the effect back into the right place in the array
					/* FIX THIS */
					var newIndex = thresholds.length-1-ind
					console.log(app.stage.fx, startIndex, newIndex)
					app.stage.fx.splice(newIndex,0,app.stage.fx.splice(startIndex)[0])
					app.stage.render()
					
				}.bind(this)
			header.addEventListener('mousedown', downHandler)

			this.el.fxPanel.insertBefore(effectControlsContainer, this.el.fxPanel.firstChild)
			effect.setupDone()
		},
		
		recursiveControlRender: function(controls, effect, parent) {
			//Recursively grab all controls as params
			var frag = parent || document.createDocumentFragment(),
				i = 0,
				l = controls.length,
				p,
				n
				
			for(i;i<l;i++) {
				p = controls[i]
				if(p.hasOwnProperty('controls')) {
					frag.appendChild(n = this.setupEffectControl('sectionTitle', undefined, {title: p.name}))
					this.recursiveControlRender(p.controls, effect,n.querySelector('.fx-control-section-content'))
				} else {
					frag.appendChild(this.setupEffectControl(p.type, effect, controls[i]))
				}
			}
			return frag
		},
		
		setupEffectControl: function(name, effect, effectControl) {
			var rawControl = this.controls[name],
				control = rawControl.init,
				controlDom = rawControl.constructDom(document.createDocumentFragment()),
				container = document.createElement('div')
			container.className = rawControl.className
			container.appendChild(controlDom)
			
			control.prototype = rawControl.proto
			
			var c = new control(effectControl, container)
			c.effect = effect
			c.control = effectControl
			c.container = container
			c.propName = effectControl.name
			c.value = effectControl.start
			c.name = rawControl.name
			c.bindEvents()
			c.changed = function(value) {
				console.log(value)
			}			
			this.activeControls.push(c)
			if(isset(rawControl.needsRow) &&!rawControl.needsRow)
				return container
			var row = this.template('fx-control-row', {label: effectControl.label || effectControl.name})
			row.appendChild(container)
			return row
		},
		
		setupSubControl: function(name, parentControl, subControl) {
			
		},
		
		template: function(name, tokens, token) {
			var s = '',
				frag = document.createDocumentFragment()
			token = token || '#'
			if(this.cachedTemplates[name]) {
				s = this.cachedTemplates[name]
			} else {
				s = document.querySelector('[data-template='+name+']').outerHTML
				this.cachedTemplates[name] = s
				if(!s) {return false}
			}
			for (key in tokens) {
				s = s.replace(new RegExp(token+key, 'g'), tokens[key]);
			}
			frag.appendChild(document.createElement('div'))
			frag.children[0].innerHTML=s
			return frag.children[0].children[0]
		},
		cachedTemplates: {}
	},
	
	stage: {
		setup: function() {
			this.ui.el.panel = $('stagePanel')
			this.canvas.width = this.width
			this.canvas.height = this.height
		},
		width: 1280,
		height: 720,
		ui: {
			el : {},
			update: function() {
				var p = this.el.panel,
					w = width(p),
					h = height(p),
					s = app.stage,
					r = Math.min(1, w/s.width, h/s.height)
				data(p, 'zoom', ~~(r*100))
				data(p, 'w', s.width)
				data(p, 'h', s.height)
				s.canvas.style.width = r*s.width+'px'
				s.canvas.style.height = r*s.height+'px'
			}
		},
		render: function(effectIndex) {
			var tempCanv = document.createElement('canvas')
				tempCtx = tempCanv.getContext('2d'),
				w = tempCanv.width = this.width,
				h = tempCanv.height = this.height
			
			this.fx.forEach(function(effect, i) {
				if(!isset(effectIndex) || effectIndex === i) {
					effect.render()
				}
				tempCtx.drawImage(effect.canvas,0,0, w, h)
			})
			var ctx = this.canvas.getContext('2d')
			ctx.clearRect(0,0,w,h)
			ctx.drawImage(tempCanv,0,0,w,h)
		},
		fxChanged: function(effect) {
			var i = this.fx.indexOf(effect)
			if(i > -1) {
				this.render(i)
			}
		},
		fx: [],
		indexOfEffect: function(uid) {
			var i = 0,
				l = this.fx.length
			for(i;i<l;i++) {
				if(this.fx[i].uid === uid) {
					return i
				}
			}
			return -1
		} 
	},
	
	fx: {
		load: function(effect) {
			this.fx[effect.name] = effect
		},
		fx: {
			
		},
		getParams: function(effect) {
			return this.findParamsRecursive(effect.controls)
		},
		findParamsRecursive: function(controls) {
			//Recursively grab all controls as params
			var params = {},
				i = 0,
				l = controls.length,
				p,
				n
				
			for(i;i<l;i++) {
				p = controls[i]
				if(p.hasOwnProperty('controls')) {
					params = merge(params, this.findParamsRecursive(p.controls))
				} else {
					n = p.name
					params[n] = p.start
				}
			}
			return params
		},
		addToStage: function(name) {
			//get the new effect and bind its prototype
			var rawEffect = this.fx[name],
				effect = rawEffect.init,
				effectCanv = document.createElement('canvas'),
				ctx = effectCanv.getContext('2d')
				
			effectCanv.width = app.stage.width
			effectCanv.height = app.stage.height
			
			effect.prototype = rawEffect.proto

			var e = new effect()
			e.name = name
			e.uid = timestamp()
			e.label = rawEffect.label || name
			e.controls = rawEffect.controls
			e.ctx = ctx
			e.canvas = effectCanv
			e.params = this.getParams(rawEffect)
			e.stage = app.stage
			
			app.stage.fx.push(e)
			app.ui.renderControlsForEffect(e)
			app.stage.render()
		}
	}
}




document.addEventListener( "DOMContentLoaded", function(){
	document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
	app.init()
}, false );

window.onresize = function(e) {
	app.ui.update()
}