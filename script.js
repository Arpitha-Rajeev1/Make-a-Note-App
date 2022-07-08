// define variables for all the necessary elements
let mode_btn = document.getElementById("mode_btn");
let text = document.getElementsByClassName("text");
let bg = document.getElementsByClassName("bg");
let save_btn = document.getElementById("save_btn");
let title = document.getElementById("title");
let content = document.getElementById("content");
let alert_empty = document.getElementById("alert");
let notes = document.getElementById("notes");
let update_btn = document.getElementById("update_btn");
let display_save = document.getElementById("display_save");
let search_btn = document.getElementById("search_btn");
let search_box = document.getElementById("search_box");

// create an empty array to store the notes of the users by title and content
let notesObj = [];
let local_notes = localStorage.getItem("local_notes");

// once notes are saved by users, localstorage will contain it and everytime the page reloads, we get the data from localstorage and put it into notesObj that is used to display
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
update_btn.style.display = "none";

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

// save the notes upon clicking a save notes button
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

        // notesObj will contain title and content as entered by the user or a default title. It also contains 2 more properties to retain the check state and the title of checkbox provided to the use for Marking particular notes as important
        notesObj.push({ "title": title.value, "content": content.value, "check": "", "mark": "Mark as important" });

        showNotes();
    }
})

// display the notes on UI
function showNotes() {
    let html = ""
    localStorage.setItem("local_notes", JSON.stringify(notesObj));
    if (notesObj.length == 0) {
        display_save.style.display = "block"; // show this message if there are notes saved yet
        notes.innerHTML = html; // notes section will be blank
    }
    else {
        
        display_save.style.display = "none"; // message disappers and notes gets added in UI

        // the changes made by adding notes is stored in localstorage to retain the changes upon reloading

        // once save button is pressed, empty the inputs of title and content
        title.value = '';
        content.value = '';
        
        // display notes in the order as they are saved 
        notesObj.forEach((element, index) => {
            html += `<div class="card m-5 flex-wrap" style="width: 18rem;">
                    <div class="form-check mx-3 mt-3">
                        <input class="form-check-input" type="checkbox" id="flexCheckDefault" onClick=checked_btn(${index}) ${element.check}>
                        <label class="form-check-label text-danger fw-bold" for="flexCheckDefault">${element.mark}</label>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.content}</p>
                        <a href="#" class="btn btn-warning mx-2" onClick=edit_btn(${index})>Edit Note</a>
                        <a class="btn btn-warning mx-2" onClick=delete_btn(${index})>Delete Note</a>
                    </div>
                </div>`
            notes.innerHTML = html; // as notes getting added, reflect it in UI
        })
    }
}

function checked_btn(index) {
    if (notesObj[index].check === "checked") {
        notesObj[index].check = "";
        notesObj[index].mark = "Mark as important"
    }
    else {
        notesObj[index].check = "checked";
        notesObj[index].mark = "Marked as important"
    }
    showNotes()
}

// remove from the localstorage as user deletes the notes
function delete_btn(index) {
    notesObj.splice(index, 1);
    showNotes()
}

// edit the saved notes
function edit_btn(index) {
    let element = notesObj[index];
    // get the old title and content in the input box respectively
    title.value = element.title;
    content.value = element.content;

    // save notes button changes to update notes button
    save_btn.style.display = "none";
    update_btn.style.display = "block";

    update_btn.addEventListener("click", () => {
        if (title.value.length === 0) {
            title.value = "Set Title Here.."
        }
        if (content.value.length === 0) {
            content.value = "Type content Here.."
        }
        // set the modified title and content in the notesObj for that particular index
        element.title = title.value;
        element.content = content.value;
        showNotes();
        save_btn.style.display = "block";
        update_btn.style.display = "none";
    })
}

search_btn.addEventListener("click", (e) => {
    e.preventDefault();
    let searched_value = search_box.value.toLowerCase();
    
    // start searching only user has entered some text to search
    if (searched_value != "") {
        let cards = document.getElementsByClassName("card"); // cards is an object
        // get the card element one by one
        Array.from(cards).forEach(function (element) {

            let h5 = element.getElementsByTagName("h5")[0];
            let p = element.getElementsByTagName("p")[0];
            let h5Text = h5.innerText.toLowerCase();
            let pText = p.innerText.toLowerCase();
            let h5Html = h5.innerHTML;
            let pHtml = p.innerHTML;    

            // display the note cards which contain the searched text either in their title or content
            if (h5Text.includes(searched_value) || pText.includes(searched_value)) {
                element.style.display = "block";
                let newText = new RegExp(searched_value, "gi");

                // temporarily highlight the text that matched with the searched value
                element.getElementsByTagName("h5")[0].innerHTML = h5Html.replace(newText, `<span style="color:red">${searched_value}</span>`)
                element.getElementsByTagName("p")[0].innerHTML = pHtml.replace(newText, `<span style="color:red">${searched_value}</span>`)
            }
            else {
                element.style.display = "none";
            }

        })
    }
    search_box.value='';
})
