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
	const colorsDiv = document.getElementById("colors");

	// create color settings
	const keys = Object.keys(lessonColors);
	const colors = Object.values(lessonColors);

	keys.forEach((lesson, i) => {
		const setting = document.createElement("div");
		setting.classList.add("color-setting");
		setting.innerHTML = `
        <span>${lesson}</span>
        <input type="color" value="${colors[i]}">
        `;
		colorsDiv.appendChild(setting);
	});
}
