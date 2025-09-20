document.addEventListener("DOMContentLoaded", async () => {
	const cbChangeColors = document.getElementById("cb-changeColors");
	const cbChangeNames = document.getElementById("cb-changeNames");
	const cbOldLayout = document.getElementById("cb-oldLayout");
	const saveBtn = document.getElementById("btn-save");
	const advBtn = document.getElementById("btn-advanced");

	const result = await chrome.storage.local.get({ changeColors: "false", changeNames: "false", oldLayout: "false" });

	cbChangeColors.checked = result.changeColors == "true" ? true : false;
	cbChangeNames.checked = result.changeNames == "true" ? true : false;
	cbOldLayout.checked = result.oldLayout == "true" ? true : false;

	saveBtn.addEventListener("click", async () => {
		const changeColors = cbChangeColors.checked.toString();
		const changeNames = cbChangeNames.checked.toString();
		const oldLayout = cbOldLayout.checked.toString();

		await chrome.storage.local.set({ changeColors, changeNames, oldLayout });
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: "reloadWindow" });
		});
		window.close();
	});

	advBtn.addEventListener("click", () => {
		chrome.tabs.create({ url: "advanced_settings.html" });
		window.close();
	});
});
