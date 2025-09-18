document.addEventListener("DOMContentLoaded", async () => {
	const cbChangeColors = document.getElementById("cb-changeColors");
	const cbChangeNames = document.getElementById("cb-changeNames");
	const saveBtn = document.getElementById("btn-save");

	const result = await chrome.storage.local.get({ changeColors: "false", changeNames: "false" });

	cbChangeColors.checked = result.changeColors == "true" ? true : false;
	cbChangeNames.checked = result.changeNames == "true" ? true : false;

	saveBtn.addEventListener("click", async () => {
		const changeColors = cbChangeColors.checked.toString();
		const changeNames = cbChangeNames.checked.toString();

		await chrome.storage.local.set({ changeColors, changeNames });
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: "reloadWindow" });
		});
		window.close();
	});
});
