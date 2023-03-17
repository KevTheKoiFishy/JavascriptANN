//make gltich.com compiler stop screaming
var trainingData, NN, gridWidth, gridHeight, updateNN, nodesByLayer,
    datagrid, displayUpdatedNN, updateConsole, updateConsoleNow,
    updateVisualizer, updateVisualizerNow, cost, backPropagate;
var displayGrid = true;


//Convert output value into output vector
// 1 -> [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
for (var Ndatum = 0; Ndatum < trainingData.length; Ndatum += 2){
  var vectorOut = [];
  for (var Nnumeral = 0; Nnumeral < 10; ++Nnumeral){
    vectorOut.push((Nnumeral == trainingData[Ndatum]) & 1);
  }
  trainingData[Ndatum] = vectorOut;
}

//Scramble training data
function scrambleTraining(){
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
}

//Convolve
function convolveTraining(convolutionMatrix){
  var convolvedTrainingData = [];
  for (var Y = 0; Y < gridHeight; ++Y){
    for (var X = 0; X < gridWidth; ++X){
      var divideMatrixBy = 9;
          if ((X == 0 || X == gridWidth) && (Y == 0 || Y == gridWidth)){ divideMatrixBy = 4; }
          if ((X == 0 || X == gridWidth) || (Y == 0 || Y == gridWidth)){ divideMatrixBy = 6; }
          for (var i = 0; i < convolutionMatrix.length; ++i)
            convolutionMatrix[i] /= divideMatrixBy;
      
      for (var i = 0; i < convolutionMatrix.length; ++i){
        var  =
            (
               (X + i%3 - 1) < 0
            || (X + i%3 - 1) > gridWidth
            || (Y + Math.floor(i/3) - 1) < 0
            || (Y + Math.floor(i/3) - 1) > gridHeight
            )
            ? 0 : trainingData[(X + i%3 - 1) + gridWidth * (Y + Math.floor(i/3) - 1)];
        convolvedTrainingData[X + gridWidth * Y] +=  * convolutionMatrix[i];
      }
    }
  }
}


//Cost Function
var costValue = 0, averageCostValue = 0;

function showCost(){
  //compute average cost
  Ndatum = 0;
  var trainInterval = setInterval( () => {
      if (Ndatum >= trainingData.length){
        clearInterval(trainInterval);
        averageCostValue /= trainingData.length / 2;
      }
      else {
        for (var i = 0; i < nodesByLayer[0]; ++i){
          NN[0][i].value = trainingData[Ndatum + 1][i];
          if (displayGrid){document.getElementById(i).className = (trainingData[Ndatum + 1][i] ? "active" : "inactive");}
        }
        updateNN(NN, nodesByLayer);

        costValue = cost(NN[NN.length - 1], trainingData[Ndatum + 1]);
        averageCostValue += costValue;
        
        if (updateConsole)      updateConsoleNow();
        if (updateVisualizer)   updateVisualizerNow();
        
        Ndatum += 2;
      }

  }, 1);
}

document.getElementById("COST").addEventListener("click", showCost);
document.getElementById("TRAIN").addEventListener("click",
  () => {
    scrambleTraining();
    if ( window.confirm("Blur the Training Data?") ){
      var convolutionMatrix = JSON.parse(window.prompt("Enter Convolution Matrix (3x3)", "[1, 3, 1, 3, 9, 3, 1, 3, 1]"));
      convolveTraining(convolutionMatrix);
    }
    backPropagate(
      JSON.parse( window.prompt("Cycles: How many cycles of backpropagating all the training data?", "1e4") ),
      JSON.parse( window.prompt("Batch size: How many training samples used to calculate gradient?", "100") ),
      JSON.parse( window.prompt("dX: Multiply gradient by this and subtract it from NN parameters.", "0.01") )
      );
  });