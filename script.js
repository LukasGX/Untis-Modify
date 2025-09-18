const lessonColors = {
	Eth: "#ffffff",
	Ev: "#ffffff",
	K: "#ffffff",
	C: "#757575",
	E: "#0cfd0c",
	Geo: "#7d5300",
	Ku: "transparent",
	Mu: "#ffba0a",
	Sm: "transparent",
	Sw: "transparent",
	L: "#ffff0f",
	F: "#ffff0f",
	D: "#ff0f0f",
	Ph: "#0ff2e3",
	G: "#ffaa00",
	M: "#334eff",
	WR: "#d1d1d1",
	WIn: "#d1d1d1",
	B: "#44693f",
};

const lessonNames = {
	Eth: "Ethik",
	Ev: "Evangelisch",
	K: "Katholisch",
	C: "Chemie",
	E: "Englisch",
	Geo: "Geographie",
	Ku: "Kunst",
	Mu: "Musik",
	Sm: "Sport (m)",
	Sw: "Sport (w)",
	L: "Latein",
	F: "Französisch",
	D: "Deutsch",
	Ph: "Physik",
	G: "Geschichte",
	M: "Mathematik",
	WR: "Wirtschaft und Recht",
	WIn: "Wirtschaftsinformatik",
	B: "Biologie",
};

const targetNode = document.body;
const config = { childList: true, subtree: true };

const cbn = () => {
	callback(null, null);
};

const callback = async (mutationsList, observer) => {
	let changeColors;
	let changeNames;

	const result = await chrome.storage.local.get(["changeColors", "changeNames"]);
	if (result.changeColors) changeColors = result.changeColors;
	else {
		await chrome.storage.local.set({ changeColors: "true" });
		changeColors = "true";
	}
	if (result.changeNames) changeNames = result.changeNames;
	else {
		await chrome.storage.local.set({ changeNames: "true" });
		changeNames = "true";
	}

	console.log(`changeColors: ${changeColors}; changeNames: ${changeNames}`);

	const lessonCards = document.querySelectorAll(".lesson-card");
	lessonCards.forEach((card) => {
		const subjectElement = card.querySelector(".lesson-card-subject");
		const subject = subjectElement.textContent.trim();
		const colorbar = card.querySelector(".lesson-card-color-bar");

		if (!subject || !colorbar) return;

		card.classList.remove("highlighted");

		// manipulate
		if (lessonColors[subject] && changeColors.toString() == "true") colorbar.style.setProperty("--color", lessonColors[subject]);
		if (lessonNames[subject] && changeNames.toString() == "true") subjectElement.textContent = lessonNames[subject];
	});

	setTimeout(() => {
		const elements = document.querySelectorAll(".timetable-grid-card.shadow");
		elements.forEach((element) => {
			element.classList.remove("shadow");
		});
	}, 0);

	const callbackCallerButtons = document.querySelectorAll(".timetable-legend-filter--content > .untis-button");
	callbackCallerButtons.forEach((ccb) => {
		ccb.removeEventListener("click", cbn);
		ccb.addEventListener("click", cbn);
	});
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "reloadWindow") {
		window.location.reload();
	}
});
