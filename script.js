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

function main(lessonColors, lessonNames) {
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

		const lessonCards = document.querySelectorAll(".lesson-card");
		lessonCards.forEach(async (card) => {
			const subjectElement = card.querySelector(".lesson-card-subject");
			const subject = subjectElement.textContent.trim();
			const colorbar = card.querySelector(".lesson-card-color-bar");

			if (!subject || !colorbar) return;

			card.classList.remove("highlighted");

			// in local storage?
			const colorResult = await chrome.storage.local.get([subject]);
			let colorToSet;
			if (colorResult[subject] !== undefined) colorToSet = colorResult[subject];
			else colorToSet = lessonColors[subject];
			// console.log(`${subject}: ${result[subject]}`);
			// const colorToSet = lessonColors[subject];

			// manipulate
			if (lessonColors[subject] && changeColors.toString() == "true") colorbar.style.setProperty("--color", colorToSet);
			if (lessonNames[subject] && changeNames.toString() == "true") subjectElement.textContent = lessonNames[subject];

			const bgColor = card.style.backgroundColor;
			if (bgColor === "rgb(223, 246, 235)") {
				card.classList.add("changed");
			}
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

	chrome.storage.local.get(["oldLayout"]).then((result) => {
		if (result.oldLayout && result.oldLayout == "true") {
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = chrome.runtime.getURL("old.css");
			document.head.appendChild(link);
		}
	});
}
