const params = new URLSearchParams(window.location.search);

document.getElementById("teacher").textContent =
    params.get("teacher") ||
    params.get("staff") ||
    "Staff Member";

let recorder;
let chunks = [];
let recording = false;
let timer;
let seconds = 0;

const WORKER_URL =
    "https://tiny-cake-5c51.mdeweese.workers.dev";

const button = document.getElementById("recordButton");
const status = document.getElementById("status");
const transcriptBox = document.getElementById("transcript");
const notesButton = document.getElementById("notesButton");
const saveButton = document.getElementById("saveButton");

notesButton.onclick = () => {
    window.location.href = "notes.html";
};

button.onclick = async () => {

    if (!recording) {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            recorder = new MediaRecorder(stream);

            chunks = [];

            recorder.ondataavailable = e => {
                chunks.push(e.data);
            };

            recorder.onstop = async () => {

                clearInterval(timer);

               const audioBlob = new Blob(chunks);

console.log("Blob size:", audioBlob.size);
console.log("Blob type:", audioBlob.type);

                status.textContent = "Transcribing...";

                transcriptBox.value = "";

               notesButton.disabled = false;
                saveButton.disabled = true;

                try {

                    const formData = new FormData();

         formData.append(
    "audio",
    audioBlob,
    "recording.webm"
);     

                    const response = await fetch(WORKER_URL, {
                        method: "POST",
                        body: formData
                    });

                    const result = await response.json();

                    console.log(result);

                    if (result.success) {

                        transcriptBox.value = result.transcript;

                        status.textContent = "Transcription complete";

                        notesButton.disabled = false;
                        saveButton.disabled = false;

                    } else {

                        status.textContent =
                            "Error: " + (result.error || "Unknown error");

                    }

                } catch (err) {

                    console.error(err);

                    status.textContent =
                        "Server connection failed";

                }

            };
console.log("Recorder MIME type:", recorder.mimeType);

recorder.start(1000);

            recording = true;

            seconds = 0;

            timer = setInterval(() => {

                seconds++;

                status.textContent =
                    `Recording... ${seconds} sec`;

            }, 1000);

            button.textContent = "STOP";
            button.classList.add("recording");

        } catch (err) {

            alert(err.message);

        }

    } else {

        recorder.stop();

        recording = false;

        button.textContent = "RECORD";
button.classList.remove("recording");

    }

};
saveButton.onclick = async () => {

    status.textContent = "Saving note...";

    try {

        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "save",
                staffId: params.get("staff") || "",
                staffName: document.getElementById("teacher").textContent,
                transcript: transcriptBox.value,
                noteType: "General"
            })
        });

        const result = await response.json();

  if (result.success) {

    console.log("Clearing transcript...");

    console.log(transcriptBox);

    transcriptBox.value = "";

    console.log("Transcript after clear:", transcriptBox.value);

    status.textContent = "✓ Note saved!";


    saveButton.disabled = true;

   
    console.log("Save disabled:", saveButton.disabled);

} else {

    status.textContent = "Save failed.";
    console.log(result);

}

} catch (err) {

    console.error(err);
    status.textContent = "Save failed.";

}

};
