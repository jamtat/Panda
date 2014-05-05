app.fx.load({
	name: 'jamparticles',
	controls: [
		{
			name: 'Emitter',
			controls: [
				{
					label:'Particles/sec',
					name:'rate',
					type:'number',
					start:10,
					step: 1
				},
				{
					label:'Position XYZ',
					name:'emitterPosition',
					type:'3dpoint',
					start:[0,0,0]
				}
			]
		},
		{
			name: 'Particle',
			controls: [
				{
					label:'Size',
					name:'size',
					type:'number',
					start:3,
					step: 1
				}
			]
		}
	],
	init: function() {
		
	},
	proto: {
		render: function() {
			console.log(this.params)
		},
		propUpdate: function(prop) {
			
		}
	}
})