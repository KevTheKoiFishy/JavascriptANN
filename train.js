//make gltich.com compiler stop screaming
var trainingData, NN, gridWidth, gridHeight, updateNN, nodesByLayer, datagrid, displayUpdatedNN;
var displayGrid = true;

//Scramble training data
var indexesNotPicked = [];
    for (var Ndatum = 0; Ndatum < trainingData.length; Ndatum += 2)
    indexesNotPicked.push(Ndatum);
var scrambledTrainingData = [];
    for (var Ndatum = 0; Ndatum < trainingData.length; Ndatum += 2){
      var indexOf_indexesNotPicked = Math.floor(Math.random() * indexesNotPicked.length);
      var indexToPick = indexesNotPicked[indexOf_indexesNotPicked];
      scrambledTrainingData.push(trainingData[indexToPick    ]);
      scrambledTrainingData.push(trainingData[indexToPick + 1]);
      indexesNotPicked.splice(indexOf_indexesNotPicked, 1);
    }
trainingData = scrambledTrainingData;
scrambledTrainingData = undefined; // save RAM

//Convert output value into output vector
// 1 -> [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
for (var Ndatum = 0; Ndatum < trainingData.length; Ndatum += 2){
  var vectorOut = [];
  for (var Nnumeral = 0; Nnumeral < 10; ++Nnumeral){
    vectorOut.push((Nnumeral == trainingData[Ndatum]) & 1);
  }
  trainingData[Ndatum] = vectorOut;
}

//backpropagate
/*
  * Derivative of cost with respect to 
*/
function cost(outputs, targets){
  var SSE = 0; //sum of squared errors
  for (var Noutput = 0; Noutput < outputs.length; ++Noutput){
    SSE += (outputs[Noutput] - targets[Noutput])**2;
  }
  return SSE/outputs.length; //return average SSError
}

function backpropagate(){
  //compute average cost
  for (var Ndatum = 0; Ndatum < 1; Ndatum += 2){
    for (var i = 0; i < gridWidth*gridHeight; ++i){
      NN[0][i].value = trainingData[Ndatum + 1][i];
      if (displayGrid){document.getElementById(i).className = (trainingData[Ndatum + 1][i] ? "active" : "inactive");}
    }
    updateNN(NN, nodesByLayer);
    displayUpdatedNN();
  }
}

document.getElementById("TRAIN").addEventListener("click", backpropagate);