// forces the session to be reloaded, makes the balance of the user refresh
export const reloadSession = () => {
	const event = new Event("visibilitychange");
	document.dispatchEvent(event);
};
