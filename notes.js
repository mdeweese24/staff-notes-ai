const notesList = document.getElementById("notesList");
const searchBox = document.getElementById("searchBox");

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxS30vJbKipCgfZQCCqR8321r8KpXQEMMs8RYHfb3TLtwgrQ3tt78Oni68KHclFFaG6Uw/exec?action=notes";

let allNotes = [];

function displayNotes(notes) {

    let html = "";

    if (notes.length === 0) {

        notesList.innerHTML = "<p>No notes found.</p>";
        return;

    }

    notes.forEach(note => {

        html += `
            <div style="
                border:1px solid #ddd;
                border-radius:10px;
                padding:15px;
                margin-bottom:15px;
                text-align:left;">

                <strong>${note.StaffName || "General Note"}</strong><br>

                <small>${note.Timestamp}</small>

                <p style="margin-top:10px;">
                    ${note.Transcript}
                </p>

            </div>
        `;

    });

    notesList.innerHTML = html;

}

async function loadNotes() {

    notesList.innerHTML = "<p>Loading notes...</p>";

    try {

        const response = await fetch(SCRIPT_URL);

        allNotes = await response.json();

        allNotes.reverse();

        displayNotes(allNotes);

    } catch (err) {

        console.error(err);

        notesList.innerHTML = "<p>Unable to load notes.</p>";

    }

}

searchBox.addEventListener("input", () => {

    const search = searchBox.value.toLowerCase();

 const filtered = allNotes.filter(note => {

    const staffName = String(note.StaffName || "").toLowerCase();
    const transcript = String(note.Transcript || "").toLowerCase();

    return staffName.includes(search) ||
           transcript.includes(search);

});

    displayNotes(filtered);

});

loadNotes();
