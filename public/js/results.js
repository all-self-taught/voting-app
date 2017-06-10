var ctx = document.getElementById('resultsChart').getContext('2d');

var results = [];
var labels = [];
var options = data.optionsInPoll;

options.forEach(function(option){
    results.push(option.count);
    labels.push(option.option);
});

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: labels,
        datasets: [{
            label: "Total Votes",
            backgroundColor: 'rgb(155, 255, 253)',
            borderColor: 'rgb(0, 230, 223)',
            data: results
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            text: data.question,
            fontSize: 24
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: function(value, index, values) {
                        if (Math.floor(value) === value) {
                            return value;
                        }
                    }

                }
            }]
        }
    }
});