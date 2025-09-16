const changeColors = true;
const changeNames = true;

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
	Ph: "#000000",
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

const callback = (mutationsList, observer) => {
	const lessonCards = document.querySelectorAll(".lesson-card");
	if (lessonCards.length > 0) {
		lessonCards.forEach((card) => {
			const subjectElement = card.querySelector(".lesson-card-subject");
			const subject = subjectElement.textContent.trim();
			const colorbar = card.querySelector(".lesson-card-color-bar");

			if (!subject || !colorbar) return;

			// manipulate
			if (lessonColors[subject] && changeColors) colorbar.style.setProperty("--color", lessonColors[subject]);
			if (lessonNames[subject] && changeNames) subjectElement.textContent = lessonNames[subject];
		});
	}
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
