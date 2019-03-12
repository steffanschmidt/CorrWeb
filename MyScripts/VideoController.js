var pythonInterfaceVideo = document.getElementById("videoPythonCompetencies");
var pythonSimulationVideo = document.getElementById("videoPythonSim");
var matlabSimulationVideo = document.getElementById("videoMatlabSim");

function videoSetup() {


    pythonInterfaceVideo.onplay = function () {
        pauseSimVideos();
    };
    pythonSimulationVideo.onplay = function () {
        pauseOthers();
    };
    matlabSimulationVideo.onplay = function () {
        pausePythonVideos();
    };

}

function pausePythonVideos() {
    alert("I am here 1");
    pythonInterfaceVideo.pause();
    pythonSimulationVideo.pause();
}

function pauseSimVideos() {
    alert("I am here 2");
    pythonSimulationVideo.pause();
    matlabSimulationVideo.pause();
}

function pauseOthers() {
    alert("I am here 3");
    pythonInterfaceVideo.pause();
    matlabSimulationVideo.pause();
}