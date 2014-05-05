app.fx.load({
	name: 'gradient',
	label: 'Gradient Fill',
	controls: [
		{
			name: 'Start',
			controls: [
				{
					name:'c1',
					label:'Colour',
					type:'colour',
					start:'#000000'
				},
				{
					label:'Opacity',
					name:'o1',
					type:'number',
					start:100,
					unit:'%',
					min:0,
					max:100
				}
				
			]
		},
		{
			name: 'End',
			controls: [
				{
					name:'c2',
					label:'End Colour',
					type:'colour',
					start: '#ffffff'
				},
				{
					label:'Opacity',
					name:'o2',
					type:'number',
					start:100,
					unit:'%',
					min:0,
					max:100
				}
				
			]
		},
		{
			label:'Overall Opacity',
			name:'o',
			type:'number',
			start:100,
			unit:'%',
			min:0,
			max:100
		},

	],
	init: function() {
		
	},
	proto: {
		setupDone: function() {
			this.setupControls = true
			this.render()
			this.stage.fxChanged(this)
		},
		render: function() {
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
			this.ctx.globalAlpha = this.params.o/100
			var grad = this.ctx.createLinearGradient(0,0,this.canvas.width,this.canvas.height)
			var c1 = hexToRgb(this.params.c1)
			var c2 = hexToRgb(this.params.c2)
			grad.addColorStop(0, 'rgba('+c1.r+','+c1.g+','+c1.b+','+this.params.o1/100+')')
			grad.addColorStop(1, 'rgba('+c2.r+','+c2.g+','+c2.b+','+this.params.o2/100+')')
			this.ctx.fillStyle=grad
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
		},
		propUpdate: function(prop, val) {
			if(this.setupControls) {
				this.params[prop] = val
				this.render()
				this.stage.fxChanged(this)
			}
		}		
	}
})