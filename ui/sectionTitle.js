app.ui.loadControl({
	name: 'sectionTitle',
	className: 'pandaSectionTitle',
	needsRow: false,
	init: function(control, container) {
		this.title = control.title
		container.appendChild(app.ui.template('fx-control-section', {title: this.title}))
		this.subContainer = container.querySelector('.fx-control-section-content')
	},
	proto: {
		bindEvents: function() {
			
		},
		get value() {
			return this.title
		},
		set value(v) {
			this.title = v
		},
		addChildren: function(dom) {
			this.subContainer.appendChild(dom)
		}
		
	},
	constructDom: function(frag) {
		return frag
	}
	
})