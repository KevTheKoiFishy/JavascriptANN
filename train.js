//make gltich.com compiler stop screaming
var trainingData, NN, gridWidth, gridHeight, updateNN, nodesByLayer,
    datagrid, displayUpdatedNN, updateConsole, updateConsoleNow,
    updateVisualizer, updateVisualizerNow, cost;
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

document.getElementById("TRAIN").addEventListener("click", showCost);