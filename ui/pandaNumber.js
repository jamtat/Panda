app.ui.loadControl({
	name: 'number',
	className: 'pandaNumber',
	init: function(control, container) {
		this.scrubberEl = container.querySelector('.pandaNumber-scrubber')
		this.inputEl = container.querySelector('.pandaNumber-input')
		var allowedChars = '0123456789.-+'
		this.inputEl.addEventListener('keypress', function(e) {
			var c = String.fromCharCode(e.keyCode)
			if(e.keyCode === 13 && !isNaN(this.inputEl.value)) {
				this.displayScrubber()
				this.value = parseFloat(this.inputEl.value)
			} else if (allowedChars.indexOf(c) > -1){
				
			} else {
				stop(e)
			}
		}.bind(this))
		
		this.inputEl.min = this.min = isset(control.min) ? control.min : -Infinity
		this.inputEl.max = this.max = isset(control.max) ? control.max : +Infinity
		this.inputEl.step = this.step = control.step || 1
		this.unit = isset(control.unit) ? control.unit : ''
	},
	proto: {
		bindEvents: function() {
			var self = this,
				movehandler = function(e) {
					stop(e)
					self.value = Math.round(self.startValue + Math.round(e.clientX - self.startX)*0.5*self.step)
				}.bind(this),
				uphandler = function(e) {
					stop(e)
					document.removeEventListener('mouseup', uphandler)
					document.removeEventListener('mousemove', movehandler)
					if(e.clientX == this.startX) {
						this.displayTextbox()
					}
					document.body.style.cursor = ''
					this.scrubberEl.classList.remove('active')
				}.bind(this)
			this.scrubberEl.addEventListener('mousedown', function(e) {
				stop(e)
				this.startX = e.clientX
				this.startValue = self.value
				this.mousemoveevent = document.addEventListener('mousemove',movehandler)
				this.mouseupevent = document.addEventListener('mouseup',uphandler)
				this.scrubberEl.classList.add('active')
			}.bind(this))
		},
		get value() {
			return this._value
		},
		set value(v) {
			this._value = Math.min(Math.max(v, this.min), this.max)
			this.scrubberEl.innerHTML = (this.inputEl.value = this._value)+this.unit
			this.effect.propUpdate(this.propName, this._value)
		},
		displayTextbox: function() {
			this.container.classList.add('keyInput')
			this.inputEl.focus()
			this.inputEl.select()
		},
		displayScrubber: function() {
			this.container.classList.remove('keyInput')
			this.inputEl.blur()
		}
		
	},
	constructDom: function(frag) {
		var div = document.createElement('div'),
			input = document.createElement('input')
		div.className = 'pandaNumber-scrubber'
		input.className = 'pandaNumber-input'
		input.type = 'number'
		frag.appendChild(div)
		frag.appendChild(input)
		
		return frag
	}
	
})