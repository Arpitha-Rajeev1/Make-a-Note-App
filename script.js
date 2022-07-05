let mode_btn = document.getElementById("mode_btn");
let text = document.getElementsByClassName("text");
let bg = document.getElementsByClassName("bg");
let save_btn = document.getElementById("save_btn");
let title = document.getElementById("title");
let content = document.getElementById("content");
let alert_empty = document.getElementById("alert");
let notes = document.getElementById("notes");
let notesObj = [];
let local_notes = localStorage.getItem("local_notes")
if (local_notes) {
    notesObj = JSON.parse(local_notes)
}
showNotes();


// define classnames needed for dark and light modes
const light_bg = 'bg-light';
const dark_bg = 'bg-dark';
const light_text = 'text-light';
const dark_text = 'text-dark';
const light_mode = document.createTextNode('Switch to Light Mode');
const dark_mode = document.createTextNode('Switch to Dark Mode');

// intialize to dark mode
for (const e of bg) {
    e.classList.add(dark_bg)
}
for (const e of text) {
    e.classList.add(light_text)
}
mode_btn.appendChild(light_mode)

// toggle between dark and light mode
mode_btn.addEventListener("click", () => {
    if (bg[0].classList.contains(dark_bg)) {
        for (const e of bg) {
            e.classList.remove(dark_bg)
            e.classList.add(light_bg)
        }
        for (const e of text) {
            e.classList.remove(light_text)
            e.classList.add(dark_text)
        }
        mode_btn.removeChild(light_mode)
        mode_btn.appendChild(dark_mode)
    }
    else {
        for (const e of bg) {
            e.classList.remove(light_bg)
            e.classList.add(dark_bg)
        }
        for (const e of text) {
            e.classList.remove(dark_text)
            e.classList.add(light_text)
        }
        mode_btn.removeChild(dark_mode)
        mode_btn.appendChild(light_mode)
    }
});

// extra notes:
// if we have to add multiple classnames, we can use spread operator 
// const multiple_class = ['class1', 'class2', 'class3']
// element.classList.add(...multiple_class)

save_btn.addEventListener("click", () => {
    if (content.value.length === 0) {
        alert_empty.innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert">
        Content field should not be empty <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        setTimeout(() => alert_empty.innerHTML = ``, 3000)
    }
    else {
        if (title.value.length === 0) {
            title.value = "Set Title Here.."
        }

        notesObj.push({ "title": title.value, "content": content.value })

        localStorage.setItem("local_notes", JSON.stringify(notesObj));
        showNotes();
    }
})

function showNotes() {

    let html = ""
    notesObj && notesObj.forEach((element) => {
        html += `<div class="card m-5 d-flex flex-wrap" style="width: 18rem;">
                    <div class="form-check mx-3 mt-3">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label text-danger fw-bold" for="flexCheckDefault">Mark as important</label>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.content}</p>
                        <a href="#" class="btn btn-warning mx-2">Edit Note</a>
                        <a href="#" class="btn btn-warning mx-2">Delete Note</a>
                    </div>
                </div>`
        notes.innerHTML = html;
    })

    title.value = '';
    content.value = '';

}
