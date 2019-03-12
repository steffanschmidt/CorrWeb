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
    pythonInterfaceVideo.pause();
    pythonSimulationVideo.pause();
}

function pauseSimVideos() {
    pythonSimulationVideo.pause();
    matlabSimulationVideo.pause();
}

function pauseOthers() {
    pythonInterfaceVideo.pause();
    matlabSimulationVideo.pause();
}