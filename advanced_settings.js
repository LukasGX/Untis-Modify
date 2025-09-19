document.addEventListener("DOMContentLoaded", async () => {
	// load config
	async function loadConfig() {
		const responseColors = await fetch(chrome.runtime.getURL("config/lessonColors.json"));
		const lessonColors = await responseColors.json();

		const responseNames = await fetch(chrome.runtime.getURL("config/lessonNames.json"));
		const lessonNames = await responseNames.json();

		return { lessonColors, lessonNames };
	}

	loadConfig().then((config) => {
		const lessonColors = config.lessonColors;
		const lessonNames = config.lessonNames;

		main(lessonColors, lessonNames);
	});
});

function main(lessonColors, lessonNames) {
	// create color settings
	const colorsDiv = document.getElementById("colors");
	const keys = Object.keys(lessonColors);
	const colors = Object.values(lessonColors);

	keys.forEach(async (lesson, i) => {
		const colorResult = await chrome.storage.local.get([lesson]);
		let colorToSet;
		if (colorResult[lesson] !== undefined) colorToSet = colorResult[lesson];
		else colorToSet = colors[i];

		const setting = document.createElement("div");
		setting.classList.add("setting");
		setting.innerHTML = `
        <span>${lesson}</span>
        <span>${lessonNames[lesson]}</span>
        <span data-next-id="${lesson}"></span>
        <div class="color-picker" data-color="${colorToSet}" data-lesson="${lesson}"></div>
        `;
		colorsDiv.appendChild(setting);
	});

	// create name settings
	const namesDiv = document.getElementById("names");
	const nKeys = Object.keys(lessonNames);
	const nNames = Object.values(lessonNames);

	nKeys.forEach((lesson, i) => {
		const setting = document.createElement("div");
		setting.classList.add("setting");
		setting.innerHTML = `
        <span class="mb">${lesson}</span>
        <input type="text" data-lesson="${lesson}" value="${nNames[i]}" id="setting-name-${lesson}" />
        `;
		namesDiv.appendChild(setting);
	});

	// include pickr script
	const script = document.createElement("script");
	script.src = "pickr.js";
	script.onload = () => {
		const pickrBase = {
			theme: "nano",
			defaultRepresentation: "HEX",
			components: {
				interaction: {
					hex: false,
					rgba: false,
					hsla: false,
					hsva: false,
					cmyk: false,
					input: true,
					clear: false,
					save: true,
				},
				preview: true,
				opacity: true,
				hue: true,
			},
			i18n: {
				"ui:dialog": "Farbwahldialog",
				"btn:toggle": "Farbauswahl umschalten",
				"btn:swatch": "Farbmuster",
				"btn:last-color": "Vorherige Farbe verwenden",
				"btn:save": "Speichern",
				"btn:cancel": "Abbrechen",

				"aria:btn:save": "speichern und schließen",
				"aria:btn:cancel": "abbrechen und schließen",
				"aria:btn:clear": "leeren und schließen",
				"aria:input": "Farbeingabefeld",
				"aria:palette": "Farbauswahlbereich",
				"aria:hue": "Farbton-Schieberegler",
				"aria:opacity": "Deckkraft-Schieberegler",
			},
		};

		const pickrEls = document.querySelectorAll(".color-picker");

		pickrEls.forEach(async (el) => {
			const color = el.dataset.color || null;

			const options = Object.assign({}, pickrBase, { el });
			if (color) options.default = color;
			const instance = Pickr.create(options);

			instance.on("save", (color, instance) => {
				const pickerEl = instance._root.root;
				const prevSpan = pickerEl.previousElementSibling;

				let lesson;
				if (prevSpan && prevSpan.hasAttribute("data-next-id")) {
					lesson = prevSpan.getAttribute("data-next-id");
				}
				chrome.storage.local.set({ [lesson]: color.toHEXA().toString() });
			});
		});
	};

	document.body.appendChild(script);

	// save btn
	const saveBtn = document.getElementById("save-btn");
	saveBtn.onclick = () => {};
}
