// set the url to a constant
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// fetch the data from the url
d3.json(url).then(function(response) {

    let dropdownMenu = d3.select("#selDataset");
    
    for (let i = 0; i < response.names.length; i++) {
        dropdownMenu.append("option").text(response.names[i])
    };

    // populate the demographics section
    populateDemo(response.metadata[0]);

    // create the initial plots
    let dataBAR = [{
        x: response.samples[0].sample_values.slice(0,10).reverse(),
        y: response.samples[0].otu_ids.slice(0,10).reverse().map(value => 'OTU ' + value),
        text: response.samples[0].otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    }];
    Plotly.newPlot("bar", dataBAR);

    let dataBUB = [{
        x: response.samples[0].otu_ids,
        y: response.samples[0].sample_values,
        text: response.samples[0].otu_labels,
        mode: "markers",
        marker: {
            size: response.samples[0].sample_values,
            color: response.samples[0].otu_ids,
        },
    }];
    let layoutBUB = {
        xaxis: {
            title: {
                text: 'OTU ID',
            },
        },
    };
    Plotly.newPlot("bubble", dataBUB,layoutBUB); 

    // create a function to handle the changes of the drop down
    d3.selectAll("#selDataset").on("change", updateData);
    function updateData() {

        // Assign the value of the dropdown menu option to a variable
        let selectedDDM = d3.select("#selDataset").property("value");

        //get the index of that value
        let dataIndex = response.names.findIndex(data => data === selectedDDM);

        // update the demographic info
        populateDemo(response.metadata[dataIndex]);

        // update the plots
        let newBAR = {
            x: [response.samples[dataIndex].sample_values.slice(0,10).reverse()],
            y: [response.samples[dataIndex].otu_ids.slice(0,10).reverse().map(value => 'OTU ' + value)],
            text: [response.samples[dataIndex].otu_labels.slice(0,10).reverse()],
        };
        Plotly.restyle("bar", newBAR);

        let newBUB = {
            x: [response.samples[dataIndex].otu_ids],
            y: [response.samples[dataIndex].sample_values],
            text: [response.samples[dataIndex].otu_labels],
            'marker.size': [response.samples[dataIndex].sample_values],
            'marker.color': [response.samples[dataIndex].otu_ids],
        };
        Plotly.restyle("bubble", newBUB);
    };

    // function to populate demographics
    function populateDemo(dataSet) {
        let demoInfo = d3.select("#sample-metadata");

        demoInfo.html("");

        for (let i = 0; i < Object.keys(dataSet).length; i++) {
            demoInfo.append("p").text(Object.keys(dataSet)[i] + ": " + Object.values(dataSet)[i])
        };
    };

});



