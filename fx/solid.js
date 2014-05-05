app.fx.load({
	name: 'solid',
	label: 'Colour Fill',
	controls: [
		{
			name:'c',
			label:'Colour',
			type:'colour',
			start:'#bada55'
		},
// 		{
// 			name: 'Colour',
// 			controls: [
// 				{
// 					name:'r',
// 					label:'Red',
// 					type:'number',
// 					start:168,
// 					min:0,
// 					max:255
// 				},
// 				{
// 					name:'g',
// 					label:'Green',
// 					type:'number',
// 					start:218,
// 					min:0,
// 					max:255
// 				},
// 				{
// 					name:'b',
// 					label:'Blue',
// 					type:'number',
// 					start:85,
// 					min:0,
// 					max:255
// 				}
// 			]
// 		},
		{
			label:'Opacity',
			name:'o',
			type:'number',
			start:100,
			unit:'%',
			min:0,
			max:100,
			step:0.5
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
			this.ctx.fillStyle=this.params.c
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