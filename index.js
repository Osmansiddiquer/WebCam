let cameraPromise = navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "user",
    }
})

const video = document.querySelector("#video");
const snap = document.getElementById('snap');
const canvas = document.getElementById("video-canvas")

cameraPromise.catch((err) => {
    console.log(err);
})
cameraPromise.then((stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
    };

    track = stream.getVideoTracks()[0];
    console.log('The device supports the following capabilities: ', track.getCapabilities());
    track.applyConstraints({
        advanced: [
            {exposureMode: 'manual'}
        ]})
})
.then(() => setInterval(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.filter = `brightness(${Number(brightness)*3}%) contrast(${Number(contrast)+50}%) saturate(${Number(saturation)}%)`;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}, 15))

snap.addEventListener('click', () => {
    let temp_canvas = document.createElement("canvas");

    temp_canvas.width = canvas.width * 6;
    temp_canvas.height = canvas.height * 6;
    let ctx = temp_canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(canvas, 0, 0, temp_canvas.width, temp_canvas.height);

    let link = document.createElement('a');
    link.download = 'captured.png';
    link.href = temp_canvas.toDataURL('image/png');
    link.click();
})
let brightness, contrast, saturation, exposure;
let sliders = document.getElementsByClassName("slider");
for(let slider of sliders){
    let output = document.querySelector(`#${slider.id}+span`);

    slider.oninput = function() {
        switch(slider.id){
            case "brightness":
                brightness = this.value;
                break;
            case "contrast":
                contrast = this.value;
                break;
            case "saturation":
                saturation = this.value;
                break;
            case "exposure":
                exposure = (5000**(1/100))**this.value + 3;
                track.applyConstraints({
                advanced: [
                        {exposureTime: exposure}
                ]})
        }
        if(slider.id == "exposure") output.innerHTML = Math.floor(exposure);
        else output.innerHTML = this.value;
    }

    switch(slider.id){
        case "brightness":
            brightness = slider.value;
            break;
        case "contrast":
            contrast = slider.value;
            break;
        case "saturation":
            saturation = slider.value;
            break;
        case "exposure":
            exposure = slider.value;
    }
    if(slider.id == "exposure") output.innerHTML = "auto";
    else output.innerHTML = slider.value;
}


// example of callback hell
let data = "";

function anda(callback){
    console.log("Started function 1");
    setTimeout(()=>{
        console.log("Completed processing 1");
        data += "refjio";
        callback(()=>{
            console.log("Started function 3");
            console.log(data);
            setTimeout(()=>{
                    console.log("Completed processing 3");
                    data += "lklj";
                    console.log(data);
                }, 1500)
        });
    }, 1500);
}
setTimeout(()=>{
    anda((callback) => {
        console.log("Started function 2");
        console.log(data);
        setTimeout(()=>{
            console.log("Completed processing 2");
            data += "jfkr";
            callback();
        }, 1500)
    })
}, 1000);