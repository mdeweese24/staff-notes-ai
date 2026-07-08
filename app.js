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

button.onclick = async () => {

    if (!recording) {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            recorder = new MediaRecorder(stream);

            chunks = [];

            recorder.ondataavailable = e => chunks.push(e.data);

            recorder.onstop = async () => {

                clearInterval(timer);

                const audioBlob = new Blob(chunks,{
                    type:"audio/webm"
                });

                window.lastRecording = audioBlob;

                status.textContent = "Testing server...";

                try {

                   const response = await fetch(WORKER_URL, {
    method: "POST",
    body: JSON.stringify({
        test: true
    })
});

const result = await response.json();

status.textContent = result.message;

                    console.log(result);

                } catch(err){

                    console.error(err);

                    status.textContent =
                    "Server connection failed";

                }

            };

            recorder.start();

            recording = true;
            seconds = 0;

            timer = setInterval(()=>{

                seconds++;

                status.textContent =
                "Recording... "+seconds+" sec";

            },1000);

            button.textContent="STOP";
            button.classList.add("recording");

        }
        catch(err){

            alert(err.message);

        }

    } else {

        recorder.stop();

        recording=false;

        button.textContent="RECORD";
        button.classList.remove("recording");

    }

};
