var gridWidth, gridHeight;

//activation function: leaky ReLU
function ReLU(inputs, weights, bias){
    var Z = 0, output = 0;
    var maxSum = inputs.length; // map final sum between 0 and 1 (max sum possible is 0 - 2)
    for (var Ninput = 0; Ninput < inputs.length; ++Ninput){
        Z += inputs[Ninput].value * weights[Ninput];
    }
    Z /= maxSum;
    //Z += bias;
    if (Z < bias) {output = 0.2 * Z;} else {output = Z - 0.8 * bias;}
    
    return [Z, output];
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
                NN[Nlayer][Nnode] = {weights: [], bias: Math.random()/2, Z: undefined, value: undefined};
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
            var ReLUOut = ReLU(NN[Nlayer - 1], NN[Nlayer][Nnode].weights, NN[Nlayer][Nnode].bias);
            NN[Nlayer][Nnode].Z     = ReLUOut[0]
            NN[Nlayer][Nnode].value = ReLUOut[1];
        }
    }
}

//localStorage.clearItem("NN");
if (localStorage.getItem("NN") == null){
  initNN(NN, nodesByLayer);
  localStorage.setItem("NN", JSON.stringify(NN));
}
else {
  NN = JSON.parse(localStorage.getItem("NN"));
}