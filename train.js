//1 - convert output value into output vector
// 1 -> [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
for (var Ndatum = 0; Ndatum < trainingData.length; Ndatum += 2){
  var vectorOut = [];
  for (var Nnumeral = 0; Nnumeral < 10; ++Nnumeral){
    vectorOut.push((Nnumeral == trainingData[Ndatum]) & 1);
  }
  trainingData[Ndatum] = vectorOut;
}

//2 backpropagate
/*
  * Derivative of cost with resepct to 
*/
function cost(outputs, targets){
  var SSE = 0; //sum of squared errors
  for (var Noutput = 0; Noutput < outputs.length; ++Noutput){
    SSE += (outputs[Noutput] - targets[Noutput])**2;
  }
  return SSE/outputs.length; //return average SSError
}

function backpropagate(){
  
  for (var i = 0; i < gridWidth*gridHeight; ++i){
    NN[0][i].value = datagrid[i];
    if (displayGrid){document.getElementById(i).className += "active";}
  }
  updateNN(NN, nodesByLayer);
}