let btn = document.querySelector('.block');
let site = document.querySelector('#url-input');
let siteArray = document.querySelector('.list-group');
let errMsg = document.querySelector('#errorMsg');

let globalList = [];
chrome.runtime.sendMessage({ type: "getList" }, function (blocklist) {
    globalList = blocklist;
    for (let i = 0; i < blocklist.length; i++) {
        addSiteToBeBlocker(blocklist[i].site);
    }
})

function addSiteToBeBlocker(value) {
    let li = document.createElement("li");
    li.classList.add("list-group-item");

    let div = document.createElement("div");
    div.classList.add("d-flex");
    div.classList.add("justify-content-between");
    div.innerHTML += `<p>${value}</p>`;

    let i = document.createElement("i");
    i.classList.add("fas");
    i.classList.add("fa-trash");

    div.append(i);
    li.append(div);
    siteArray.append(li);

    i.addEventListener("click", function () {
        i.parentNode.parentNode.remove();

        // send site to be remove from blocklist
        chrome.runtime.sendMessage({ type: "delete", site: value }, function (res) {
            console.log(res);
        });
    })
}

btn.addEventListener('click', function () {
    let value = site.value;
    if (value) {
        for (let i = 0; i < globalList.length; i++) {
            if (globalList[i].site.includes(value) || value.includes(globalList[i].site)) {
                errMsg.style.display = 'block';
                errMsg.innerHTML = "Site already added";
                site.value = "";
                return;
            }
        }
        globalList.push({ site: value });
        addSiteToBeBlocker(value);
        site.value = "";

        // send site to be blocked
        chrome.runtime.sendMessage({ type: "add", site: value }, function (res) {
            console.log(res);
        });
    }

})