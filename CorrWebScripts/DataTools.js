function data_tools_setup()
{
    btn_setup_datatools = ["t_min", "t_max", "t_int", "v_min", "v_max", "v_int"];

    for (let i = 0; i < btn_setup_datatools.length; i++)
    {
        $("#" + btn_setup_datatools[i]).change(function ()
        {
            graphing();
        });
    };

    // adding functionality to data buttons
    btn_data_ext = ["import_data", "export_data", "export_graph", "plot_upd"];
    btn_data_fcn = [load_data_from_exp, data_export_to_file, data_export_to_img, graphing];

    for (let i = 0; i < btn_data_ext.length; i++)
    {
        var extract_obj = document.getElementById(btn_data_ext[i]);
        extract_obj.addEventListener("click", btn_data_fcn[i]);
    };
    // adding plot area to canvas
    chart = new CanvasJS.Chart("plot_area", {
        title: {
            text: "Corrosion Measurement",
            fontSize: 24,
            fontColor: "black"
        },
        axisX: {
            interval: 0.1,
            title: "Time (s)",
            titleFontSize: 20,
            titleFontColor: "black",
            titleFontWeight: "bold",
            labelFontSize: 16,
            labelFontColor: "black",
            tickColor: "black",
            gridColor: "black",
            lineColor: "black"
        },
        axisY: {
            title: "Voltage (V)",
            titleFontSize: 20,
            titleFontColor: "black",
            titleFontWeight: "bold",
            labelFontSize: 16,
            labelFontColor: "black",
            tickColor: "black",
            gridColor: "black",
            lineColor: "black"
        },
        data: [{
            type: "line",
            dataPoints: data_points
        }]
    });

    chart.render();
};

var data_points = [];
var chart;

function load_data_from_exp()
{
    alert("Loading Data");
};

function data_export_to_file() 
{
    alert("Extracting to File");
};

function data_export_to_img() {
    alert("Extracting to Img")
};


function graphing()
{

    // Setting up parameters for graphing options
    var data_fields = ["t_min", "t_max", "t_int", "v_min", "v_max", "v_int"];
    var input_values = [];
    for (let i = 0; i < data_fields.length; i++)
    {
        var input_val = document.getElementById(data_fields[i]).value;
        input_values.push(input_val);
    };

    // Assigning values to each parameters
    tmin = Number(input_values[0]);
    tmax = Number(input_values[1]);
    tinterval = Number(input_values[2]);
    Vmin = Number(input_values[3]);
    Vmax = Number(input_values[4]);
    Vint = Number(input_values[5]);

    // setting default values incase none are specified
    if (tmin == null || tmin == "") { tmin = 0 };
    if (tmax == null || tmax == "") { tmax = 50000 };
    if (tinterval == null || tinterval == "") { tinterval = 2500 };
    if (Vmin == null || Vmin == "") { vmin = 0 };
    if (Vmax == null || Vmax == "") { vmax = 1 };
    if (Vmax == null || Vmax == "") { vmax = 1 };
    if (Vint == null || Vint == "") { Vint = 0.1 };

    // 

    // updating graph with data
    data_points.push({ x: 5, y: 10 }, { x: 20, y: 15 });

    // Updating Options if specified
    // y-axis
    chart.options.axisY.interval = Vint;
    chart.options.axisY.minimum = Vmin;
    chart.options.axisY.maximum = Vmax;
    // x-axis
    chart.options.axisX.interval = tinterval;
    chart.options.axisX.minimum = tmin;
    chart.options.axisX.maximum = tmax;
    chart.render();
};