const elements = document.querySelectorAll('.widgetBar');

fetch("modulePages/subscribe_widget.html")
    .then(response => response.text())
    .then(data => {
        elements.forEach(element => {
            element.insertAdjacentHTML("afterbegin", data);
        });
    })
    .catch(error => console.error("加载订阅组件失败：", error));
