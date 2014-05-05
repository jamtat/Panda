app.ui.loadControl({
	name: 'colour',
	className: 'pandaColour',
	init: function(control, container) {
		this.inputEl = container.querySelector('.pandaColour-input')
	},
	proto: {
		bindEvents: function() {
			this.inputEl.addEventListener('change', function(e) {
				this.value = this.inputEl.value
			}.bind(this))
		},
		get value() {
			return this._value
		},
		set value(v) {
			this._value = this.inputEl.value = v
			this.effect.propUpdate(this.propName, this._value)
		}
	},
	constructDom: function(frag) {
		var input = document.createElement('input')
		input.className = 'pandaColour-input'
		input.type = 'color'
		frag.appendChild(input)
		
		return frag
	}
	
})