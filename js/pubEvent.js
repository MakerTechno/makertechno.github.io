const EventBus = {
    emit(eventName, data = null) {
        const event = data ? new CustomEvent(eventName, { detail: data }) : new Event(eventName);
        document.dispatchEvent(event);
    },

    on(eventName, callback) {
        document.addEventListener(eventName, (event) => {
            callback(event.detail ?? event);
        });
    },

    off(eventName, callback) {
        document.removeEventListener(eventName, callback);
    }
};

/* e.g.
EventBus.on('broadcast', (data) => console.log('recieved broadcast:', data));
EventBus.emit('broadcast', { message: 'Hello, World!' });
*/

function waitForElement(id, callback) {
    const interval = setInterval(() => {
        const element = document.getElementById(id);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 500);
}
/* e.g.
waitForElement('targetElement', (el) => {
    console.log('Found element:', el);
});
 */

function setCache(key, value, expireHours) {
	const now = new Date().getTime();
	const expireTime = now + expireHours * 60 * 60 * 1000;
	const data = {
		value,
		expireTime
	};
	localStorage.setItem(key, JSON.stringify(data));
}

function getCache(key) {
	const dataStr = localStorage.getItem(key);
	if (!dataStr) return null;

	const data = JSON.parse(dataStr);
	if (new Date().getTime() > data.expireTime) {
		localStorage.removeItem(key);
		return null;
	}
	return data.value;
}

// 存储信息，时长为12小时
// setCache('myData', 'Hello, MakerTechno!', 12);

// 读取信息
// console.log(getCache('myData'));