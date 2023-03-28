//activation function: leaky ReLU
function ReLU(prevLayer, weights, bias){
    var Z = 0, output = 0;
    var maxSum = prevLayer.length; // map final sum between 0 and 1 (max sum possible is 0 - 2)
    for (var Ninput = 0; Ninput < prevLayer.length; ++Ninput){
        Z += prevLayer[Ninput].value * weights[Ninput];
    }
    //Z /= maxSum;
    //Z += bias;
    if (Z < bias) {output = 0.2 * Z;} else {output = 2*Z - 1.8 * bias;}
    return [Z, output];
};

// init NN
// var nodesByLayer = [1, 1, 1, 1];
// var NN =
// [
//     [{value: undefined}],
//     [{value: undefined, Z: undefined, weights: [0.5],      bias: 0}, {value: undefined, Z: undefined, weights: [0.5],      bias: 0}],
//     [{value: undefined, Z: undefined, weights: [0.5, 0.5], bias: 0}, {value: undefined, Z: undefined, weights: [0.5, 0.5], bias: 0}],
//     [{value: undefined, Z: undefined, weights: [0.5, 0.5], bias: 0}],
// ];
var gridWidth, gridHeight;
var nodesByLayer = [gridWidth*gridHeight, 10];
var NN = [];
function initNN(){
    for (var Nlayer = 0; Nlayer < nodesByLayer.length; ++Nlayer){
        NN[Nlayer] = [];
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            NN[Nlayer][Nnode] = {value: 0};
            if (Nlayer > 0){
                NN[Nlayer][Nnode] = {weights: [], bias: 0, Z: 0, value: 0};
                for (var NnodePrev = 0; NnodePrev < nodesByLayer[Nlayer - 1]; ++NnodePrev){
                    NN[Nlayer][Nnode].weights[NnodePrev] = Math.random()/NN[Nlayer-1].length;
                }
            }
        }
    }
}


if (localStorage.getItem("NN")) {
  NN = JSON.parse(localStorage.getItem("NN"));
} else {
  initNN();
  localStorage.setItem("NN", JSON.stringify(NN));
}

function updateNN(inputLayer){
    //load first layer
    var Nlayer = 0;
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode)
            NN[Nlayer][Nnode].value = inputLayer[Nnode];
    
    // feed forward
    for (var Nlayer = 1; Nlayer < nodesByLayer.length; ++Nlayer){
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            var ReLUOut = ReLU(NN[Nlayer - 1], NN[Nlayer][Nnode].weights, NN[Nlayer][Nnode].bias);
            NN[Nlayer][Nnode].Z     = ReLUOut[0];
            NN[Nlayer][Nnode].value = ReLUOut[1];
        }
    }
}

//Cost function
function cost(outputs, targets){
  var SSE = 0; //sum of squared errors
  for (var Noutput = 0; Noutput < outputs.length; ++Noutput){
    SSE += (outputs[Noutput].value - targets[Noutput])**2;
  }
  return SSE/outputs.length; //return average SSError
}
                
//Cost Function Gradient
var NNg =
[
    // [{dValue: 0}],
    // [{dValue: 0, dWeights: [0], dBias: 0}],
    // [{dValue: 0, dWeights: [0], dBias: 0}],
    // [{dValue: 0, dWeights: [0], dBias: 0}],
];
function initNNg(){
    for (var Nlayer = 0; Nlayer < nodesByLayer.length; ++Nlayer){
        NNg[Nlayer] = [];
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            NNg[Nlayer][Nnode] = {dValue: 0};
            if (Nlayer > 0){
                NNg[Nlayer][Nnode] = {dValue: 0, dWeights: [], dBias: 0};
                for (var NnodePrev = 0; NnodePrev < nodesByLayer[Nlayer - 1]; ++NnodePrev){
                    NNg[Nlayer][Nnode].dWeights[NnodePrev] = 0;
                }
            }
        }
    }
}

function dCost_dReLU (out, target) { return 2 * (out - target);   }
function dReLU_dZ    (Z, bias)     { return (Z > bias) ? 1 : 0.2; }
// function dValue  (weight)          { return weight;               }
// function dWeight (PrevLayerValue)  { return PrevLayerValue;       }
function dReLU_dBias (Z, bias)     { return (Z > bias) ? -2 : 0;  }
function updateNNg(inputLayer, targetOutput){
    initNNg();
    updateNN(inputLayer);

    for (var Nlayer = NN.length - 1; Nlayer >= 0; --Nlayer){
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            //how cost changes with final output layer
            if (Nlayer == NN.length - 1)
                NNg[Nlayer][Nnode].dValue = dCost_dReLU(NN[Nlayer][Nnode].value, targetOutput[Nnode]);
            
            //how cost changes with value of Nlayer's outputs
            var dC_dF = NNg[Nlayer][Nnode].dValue;            
            var dC_dZ = dC_dF * dReLU_dZ(NN[Nlayer][Nnode].Z, NN[Nlayer][Nnode].bias); //dC_dF * dF/dZ
            
            //How much each of Nlayer's nodes should change its biases
            NNg[Nlayer][Nnode].dBias = dC_dF * dReLU_dBias(NN[Nlayer][Nnode].Z, NN[Nlayer][Nnode].bias);
            for (var NnodePrev = 0; NnodePrev < nodesByLayer[Nlayer - 1]; ++NnodePrev){
                //How much each of Nlayer's nodes wants a given prev layer's node to change
                NNg[Nlayer - 1][NnodePrev].dValue      += dC_dZ * NN[Nlayer][Nnode].weights[NnodePrev] / nodesByLayer[Nlayer];
                //Each of Nlayer's nodes should change [each of its weights proportionally with the input value it weights]
                NNg[Nlayer][Nnode].dWeights[NnodePrev]  = dC_dZ * NN[Nlayer - 1][NnodePrev].value;
            }
        }
    }
}

var scrambleTraining, trainingData;
//compute gradient & adjust function for each batch of training data
function backPropagate(cycles, batchSize, dX){
  
    for (var Ncycle = 0; Ncycle < cycles; ++Ncycle){
        console.log(Ncycle);
        scrambleTraining();
      
        for (var Nbatch = 0; Nbatch < trainingData.length/(2*batchSize); ++Nbatch){
            initNNg();
            var changesThisBatch = NNg;
            
            for (var Ndatum = Nbatch * 2*batchSize; Ndatum < (Nbatch + 1) * 2*batchSize; Ndatum += 2){
                updateNNg(trainingData[Ndatum+1], trainingData[Ndatum]);
    
                //add 1/batchSize * NNg to changesThisBatch
                for (var Nlayer = 0; Nlayer < nodesByLayer.length; ++Nlayer){
                    for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
                        changesThisBatch[Nlayer][Nnode].dValue += NNg[Nlayer][Nnode].dValue/batchSize;
                        if (Nlayer > 0){
                            changesThisBatch[Nlayer][Nnode].dBias += NNg[Nlayer][Nnode].dBias/batchSize;
                            for (var NnodePrev = 0; NnodePrev < nodesByLayer[Nlayer - 1]; ++NnodePrev){
                                changesThisBatch[Nlayer][Nnode].dWeights[NnodePrev] += NNg[Nlayer][Nnode].dWeights[NnodePrev]/batchSize;
                            }
                        }
                    }
                }
                
            }
    
            //add changesThisBatch to NN
            for (var Nlayer = 1; Nlayer < nodesByLayer.length; ++Nlayer){
                for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
                    NN[Nlayer][Nnode].bias -= dX * changesThisBatch[Nlayer][Nnode].dBias;
                    for (var NnodePrev = 0; NnodePrev < nodesByLayer[Nlayer - 1]; ++NnodePrev){
                        NN[Nlayer][Nnode].weights[NnodePrev] -= dX * changesThisBatch[Nlayer][Nnode].dWeights[NnodePrev];
                    }
                }
            }
            
        }
        
        //dX *= 0.99;
    }
  
    localStorage.setItem("NN", JSON.stringify(NN));
}