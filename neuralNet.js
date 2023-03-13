//activation function
function ReLU(inputs, weights, bias){
    var output = 0;
    var maxSum = inputs.length; // map final sum between 0 and 1 (max sum possible is 0 - 2)
    for (var Ninput = 0; Ninput < inputs.length; ++Ninput){
        output += inputs[Ninput].value * weights[Ninput];
    }
    if (output < 0) {output = 0;}
    output /= maxSum;
    output += bias;
    
    return output;
};

// init NN
var NN = [];
var nodesByLayer = [gridWidth*gridHeight, 16, 16, 10];
function initNN(NN, nodesByLayer){
    for (var Nlayer = 0; Nlayer < nodesByLayer.length; ++Nlayer){
        NN[Nlayer] = [];
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            NN[Nlayer][Nnode] = {value: Math.random()};
            if (Nlayer > 0){
                NN[Nlayer][Nnode] = {weights: [], bias: Math.random()/2, value: undefined};
                for (var NnodePrev = 0; NnodePrev < nodesByLayer[Nlayer - 1]; ++NnodePrev){
                    NN[Nlayer][Nnode].weights[NnodePrev] = Math.random();
                }
            }
        }
    }
}

function updateNN(NN, nodesByLayer){
    for (var Nlayer = 1; Nlayer < nodesByLayer.length; ++Nlayer){
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            NN[Nlayer][Nnode].value = ReLU(NN[Nlayer - 1], NN[Nlayer][Nnode].weights, NN[Nlayer][Nnode].bias);
        }
    }
}

if (localStorage.getItem("NN") == null){
  initNN(NN, nodesByLayer);
  localStorage.setItem("NN", JSON.stringify(NN));
}
else {
  NN = JSON.parse(localStorage.getItem("NN"));
}