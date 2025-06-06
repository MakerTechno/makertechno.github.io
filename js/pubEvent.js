
async function loadAndExecuteScript(src) {
    try {
        const message = await loadScript(src);
        console.log(message);
    } catch (error) {
        console.error(error);
    }
}

loadAndExecuteScript('./loadings.js');
