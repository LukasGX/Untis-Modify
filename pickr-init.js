document.addEventListener("DOMContentLoaded", () => {
	const pickers = document.querySelectorAll(".color-picker");
	pickers.forEach((pickerEl) => {
		Pickr.create({
			el: pickerEl,
			theme: "nano",
			defaultRepresentation: "HEX",
			components: {
				interaction: {
					hex: true,
					rgba: false,
					hsla: false,
					hsva: false,
					cmyk: false,
					input: true,
					clear: true,
					save: true,
				},
				preview: true,
				opacity: true,
				hue: true,
			},
		});
	});
});
