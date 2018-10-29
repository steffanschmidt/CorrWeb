function setup_tools()
{   
    // Setting up functionality for tools
    btn_setup_teensy = ["pause", "continue", "stopmeasuring"];
    btn_setup_teensy_fcn = [pause, continue_measuring, stop_measuring];

    btn_setup_network = ["find_networks", "connect_to", "reestablish", "reset_connection"];
    btn_setup_network_fcn = [find_network, connect_to_network, reestablish_connection, rst_connection];

    for (let i = 0; i < btn_setup_teensy.length ; i++)
    {
        let temp_obj = document.getElementById(btn_setup_teensy[i]);
        temp_obj.addEventListener("click", btn_setup_teensy_fcn[i]);
    };


    for (let i = 0; i < btn_setup_network.length ; i++)
    {
        let temp_obj = document.getElementById(btn_setup_network[i]);
        temp_obj.addEventListener("click", btn_setup_network_fcn[i]);
    };

    find_network();
};

// For clearing list of network connections on call
function clearNetworkList(parent_list)
{
    while (parent_list.firstChild)
    {
        parent_list.removeChild(parent_list.firstChild);
    };
};

// Network functions
function find_network()
{  
    var select_parent = document.getElementById("network_finder");
    clearNetworkList(select_parent);

    available_networks = ["network1", "network2", "network3", "network4", "network5"]; 

    for (let i = 0; i < available_networks.length; i++)
    {
        var option_child = document.createElement("option");
        option_child.text = available_networks[i];
        option_child.value = available_networks[i];
        select_parent.appendChild(option_child);
    };
};


function reestablish_connection()
{
    alert("Re-Establish");
};

function connect_to_network()
{
    alert("Connecting");
};

function rst_connection()
{
    alert("Reset");
};


// Teensy functions
function pause()
{
    alert("Pause");
};

function continue_measuring()
{
    alert("Continue Measuring");
};

function stop_measuring()
{
    alert("Stop Measuring");
};