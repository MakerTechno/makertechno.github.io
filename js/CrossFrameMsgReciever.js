window.addEventListener(
	'message', (event) => {
		if (event.data.type === "CUSTOM_MESSAGE" && event.data.payload.data == 'type') { 
			if (event.data.payload.mode == 'lightMode') setLight();
			else setDark();
		}
	}
);