const socket = io("http://localhost:4000");

socket.on("connect", () => {
    let userForm = document.querySelector("#user-form");
    userForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let userInput = document.querySelector("#user-input").value;
        socket.emit("userInputFromClient", userInput);
    });

    socket.on("userInputFromServer", (data) => {
        let listMessages = document.getElementById("list-message");
        listMessages.innerHTML += `<li class="item">${data}</li>`;
        console.log(listMessages);
    });
});