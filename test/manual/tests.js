/*******************************************************************************
 * LOADS THE REQUIRED DEPEDENCIES
 * 		- call the test page with '?requireJS' to test the requireJS definition of ReactiveGauge
 * 		- call it without parameter to test it as vanilla js
 * 
 ******************************************************************************/
/**
 * Loads a script
 */
var createScript = (src, data) => {
	var promise = new Promise((res, rej)=>{
		var script=document.createElement('script');
		script.src = src;
		if (data){
			script.dataset.main = data;
		}
		script.onload = res;
		head.appendChild(script);
	});
			
	
	return promise;
};

/**
 * Loads the required scripts depending the environment tested
 */
var mode = document.location.search.slice(1)
var head = document.head;
// requireJS : loads the lib, require the gauges and start the tests
if (mode === 'requireJS'){
	createScript('lib/require.min.js', '../../dist/ReactiveGauge.min.js').then(()=>{
		require(['ReactiveGauge'], (ReactiveGauge)=>{
			this.ReactiveGauge = ReactiveGauge;
			startTests();
		});
	});
	
	// vanilla : sets the dependencies in <HEAD> then start the tests
} else {
	// retrieve the protocol to allow use in a https page
	var protocol = document.location.protocol;
	// required when testing locally
	protocol = (protocol === 'file:' ? 'http:' : protocol);

	var promD3 = createScript(protocol + "//cdn.jsdelivr.net/d3js/3.5.16/d3.min.js");
	var promNumbro = createScript(protocol + "//cdnjs.cloudflare.com/ajax/libs/numbro/1.7.1/numbro.min.js");

	Promise.all([promD3, promNumbro]).then(()=>{
// createScript('../../src/ReactiveGauge.js').then(setTimeout(startTests, 100));
		createScript('../../dist/ReactiveGauge.min.js').then(setTimeout(startTests,100));
	});
}


function startTests(){
	/***************************************************************************
	 * GAUGES CONFIG
	 **************************************************************************/
	// default config for the tests
	ReactiveGauge.config.colors = 'gradient';
	ReactiveGauge.config.minAngle = 0;
	ReactiveGauge.config.maxAngle = 90;
	ReactiveGauge.config.maxValue = 800;
	
	/**
	 * Generate configs for angles checks gauges.
	 */
	function getAngleCheckConfig(minAngle, maxAngle, otherConfig){
		var config = {
			minAngle : minAngle,
			maxAngle : maxAngle,
			minValue : minAngle,
			maxValue : maxAngle
		};
	
		for ( var prop in otherConfig) {
			config[prop] = otherConfig[prop];
		}
	
		return config;
	}
	
	
	/***************************************************************************
	 * GAUGES INITIALIZATION
	 **************************************************************************/
	
	var gauges = [];
	
	// quarters
	gauges.push(ReactiveGauge('#qgauge1', getAngleCheckConfig(-90, 0)));
	gauges.push(ReactiveGauge('#qgauge2', getAngleCheckConfig(0, 90)));
	gauges.push(ReactiveGauge('#qgauge3', getAngleCheckConfig(90, 180)));
	gauges.push(ReactiveGauge('#qgauge4', getAngleCheckConfig(180, 270)));
	
	// halves
	gauges.push(ReactiveGauge('#hgauge1', getAngleCheckConfig(-90, 90)));
	gauges.push(ReactiveGauge('#hgauge2', getAngleCheckConfig(90, 270)));
	gauges.push(ReactiveGauge('#hgauge3', getAngleCheckConfig(180, 360)));
	gauges.push(ReactiveGauge('#hgauge4', getAngleCheckConfig(0, 180)));
	
	// three quarters
	gauges.push(ReactiveGauge('#tgauge1', getAngleCheckConfig(-90, 180)));
	gauges.push(ReactiveGauge('#tgauge2', getAngleCheckConfig(0, 270)));
	gauges.push(ReactiveGauge('#tgauge3', getAngleCheckConfig(90, 360)));
	gauges.push(ReactiveGauge('#tgauge4', getAngleCheckConfig(180, 450)));
	
	// full
	gauges.push(ReactiveGauge('#fgauge', getAngleCheckConfig(0, 360)));
	
	// custom angles (quarters)
	gauges.push(ReactiveGauge('#custom-quarter-gauge1', getAngleCheckConfig(-80, -10)));
	gauges.push(ReactiveGauge('#custom-quarter-gauge2', getAngleCheckConfig(20, 70)));
	gauges.push(ReactiveGauge('#custom-quarter-gauge3', getAngleCheckConfig(100, 170)));
	gauges.push(ReactiveGauge('#custom-quarter-gauge4', getAngleCheckConfig(210,  230, {labelNumber : 2})));
	
	// custom angles (halves)
	gauges.push(ReactiveGauge('#custom-half-gauge1', getAngleCheckConfig(-45, 45)));
	gauges.push(ReactiveGauge('#custom-half-gauge2', getAngleCheckConfig(20, 130)));
	gauges.push(ReactiveGauge('#custom-half-gauge3', getAngleCheckConfig(100, 223)));
	gauges.push(ReactiveGauge('#custom-half-gauge4', getAngleCheckConfig(210, 300)));
	
	// custom angles (three quarters)
	gauges.push(ReactiveGauge('#custom-three-gauge1', getAngleCheckConfig(260, 550)));
	gauges.push(ReactiveGauge('#custom-three-gauge2', getAngleCheckConfig(20, 223)));
	gauges.push(ReactiveGauge('#custom-three-gauge3', getAngleCheckConfig(100, 300)));
	gauges.push(ReactiveGauge('#custom-three-gauge4', getAngleCheckConfig(210, 390)));
	
	// COLORS / GRADIENTS
	gauges.push(ReactiveGauge('#gradient-gauge', {
		colors : 'gradient'
	}));
	gauges.push(ReactiveGauge('#sector-gradient-gauge', {
		colors : 'sectors'
	}));
	gauges.push(ReactiveGauge('#custom-sectors-gauge', {
		colors : [ '#FFF', '#FFF', '#FFF', '#FF7C88', '#D50000' ],
		border : true
	}));
	
	// BORDERS
	gauges.push(ReactiveGauge('#without-border-gauge', {
		colors : [ '#FFF']
	}));
	gauges.push(ReactiveGauge('#with-border-gauge', {
		colors : [ '#FFF'],
		border : true
	}));
	
	// SIZE AND POSITION
	gauges.push(ReactiveGauge('#wide-gauge', {
		ringShift : 0,
		ringWidth : 14,
		labelShift : 8,
		pointerType : 'filament'
	}));
	gauges.push(ReactiveGauge('#inner-label-gauge', {
		ringShift : 0,
		ringWidth : 7,
		labelShift : 12,
		needleLength : 75
	}));
	gauges.push(ReactiveGauge('#no-gauge', {
		labelShift : 0,
		ringShift : 5,
		ringWidth : 0.5,
		fillerWidth : 7,
		fillerShift : 2,
		pointerType : 'filler',
		colors : false
	}));
	gauges.push(ReactiveGauge('#bi-gauge', {
		labelShift : 9,
		pointerType : 'filler',
		fillerShift : 12,
		fillerWidth : 6,
		ringShift : 10,
		ringWidth : 2,
		valueShift : 15,
		colors : false
	}));
	
	// LABELS
	gauges.push(ReactiveGauge('#no-label-gauge', {
		labelNumber : 0
	}));
	gauges.push(ReactiveGauge('#long-label-gauge', {
		labelNumber : 8,
		maxValue : 100000
	}));
	gauges.push(ReactiveGauge('#custom-labels-gauge', {
		labelNumber : 2,
		colors : 'sectors'
	}))
	gauges.push(ReactiveGauge('#suffixed-label-gauge', {
		valueUnit : 'km/h'
	}));	
	
	
	// POINTERS
	gauges.push(ReactiveGauge('#needle-pointer-gauge', {
		pointerType : 'needle'
	}));
	gauges.push(ReactiveGauge('#filament-pointer-gauge', {
		pointerType : 'filament'
	}));
	gauges.push(ReactiveGauge('#filler-pointer-gauge', {
		pointerType : 'filler',
		colors : false
	}));
	gauges.push(ReactiveGauge('#slow-pointer-gauge', {
		pointerSlowness : 1000			
	}));
	
	
	/***************************************************************************
	 * DISPLAY AND REFRESH THE GAUGES
	 **************************************************************************/
	var refresh = ()=>gauges.forEach(g=>{
		var config = g.getConfig();
		var range = config.maxValue - config.minValue;
		var value = config.minValue + (Math.random() * range);
		g.update(value);
	});		
	refresh();
// setInterval(refresh, 5000);
	
	// display gauges options on over
	gauges.forEach(g=>{
		var cont = g.container;
		cont.append('div')//
			.attr('class', 'gauge-config')
			.text(JSON.stringify(g.getConfig(), null, 4));
		cont.on('mouseover', ()=>{
			d3.select(d3.event.currentTarget).select('div').classed('visible', true);
		});
		cont.on('mouseout', ()=>{
			d3.select(d3.event.currentTarget).select('div').classed('visible', false);
		});
	});
}
