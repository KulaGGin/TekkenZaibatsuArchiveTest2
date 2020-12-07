
hs.showCredits = false;
hs.outlineType = 'rounded-white';
hs.align = 'center';
hs.allowMultipleInstances = false;
hs.headingEval = 'this.thumb.alt';


// Add the slideshow controller
hs.addSlideshow({
	slideshowGroup: 'group1',
	interval: 2500,
	repeat: false,
	useControls: true,
	fixedControls: 'fit',
	overlayOptions: {
		className: 'controls-in-heading',
		opacity: '0.75',
		position: 'top right',
		offsetX: '20',
		offsetY: '-20',
		hideOnMouseOut: false
	}
});

// gallery config object
var config1 = {
	slideshowGroup: 'group1',
	transitions: ['expand', 'crossfade']
};
