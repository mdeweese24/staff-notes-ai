const notesList = document.getElementById("notesList");

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxS30vJbKipCgfZQCCqR8321r8KpXQEMMs8RYHfb3TLtwgrQ3tt78Oni68KHclFFaG6Uw/exec?action=notes";

async function loadNotes() {

    notesList.innerHTML = "<p>Loading notes...</p>";

    try {

        const response = await fetch(SCRIPT_URL);

        const notes = await response.json();

        notes.reverse();

        let html = "";

        notes.forEach(note => {

            html += `
                <div style="border:1px solid #ddd;
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

    } catch (err) {

        console.error(err);

        notesList.innerHTML =
            "<p>Unable to load notes.</p>";

    }

}

loadNotes();
