//make gltich.com compiler stop screaming
var trainingData, NN, gridWidth, gridHeight, gridSize, updateNN, nodesByLayer,
    datagrid, displayUpdatedNN, updateConsole, updateConsoleNow,
    updateVisualizer, updateVisualizerNow, cost, backPropagate;
var displayGrid = true;


//Convert output value into output vector
// 1 -> [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
function vectorizeOutput(character){
  var vectorOut = [];
  for (var Nnumeral = 0; Nnumeral < 10; ++Nnumeral){
    vectorOut.push((Nnumeral == character) & 1);
  }
  return vectorOut;
}

for (var Ndatum = 0; Ndatum < trainingData.length; Ndatum += 2){
  trainingData[Ndatum] = vectorizeOutput(trainingData[Ndatum]);
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
function convolveGrid(grid, convolutionMatrix) {
  var convolvedGrid = [];
    for (var Ncell = 0; Ncell < gridSize; ++Ncell)
        convolvedGrid.push(0);

  for (var Y = 1; Y < gridHeight-1; ++Y) {
    for (var X = 1; X < gridWidth-1; ++X) {

      for (var convolveY = 0; convolveY < 3; ++convolveY) {
        for (var convolveX = 0; convolveX < 3; ++convolveX) {
          convolvedGrid[Y * gridWidth + X]
            += grid[(X + convolveX-1) + gridWidth * (Y + convolveY-1)]
            *  convolutionMatrix[(convolveY) * 3 + (convolveX)];
        }
      }

    }
  }

  return convolvedGrid;
}
function convolveTraining(convolutionMatrix){
  for (var Nsample = 1; Nsample < trainingData.length; Nsample += 2)
    trainingData[Nsample] = convolveGrid(trainingData[Nsample], convolutionMatrix);
}

//Cost Function
var costValue = 0, totalCost = 0, averageCostValue = 0, numCorrect = 0;
var Ndatum = 0;
var highestP = 0, predictedNum = 0;

function showCost(){
  costValue = 0, totalCost = 0, averageCostValue = 0;
  Ndatum = 0;
  numCorrect = 0;

  //compute average cost
  var costCheckInterval =
      setInterval( () => {
          if (Ndatum >= trainingData.length){
            clearInterval(costCheckInterval);
          }
        
          else {
            datagrid = trainingData[Ndatum + 1];
            updateGrid(datagrid);
            
            updateNN(datagrid);

            costValue = cost(NN[NN.length - 1], trainingData[Ndatum + 1]);
            totalCost += costValue;
            averageCostValue = totalCost / (Ndatum / 2);
            
            highestP     = 0;
            predictedNum = 0;
            for (var i = 0; i < NN[NN.length - 1].length; ++i){
              var val = NN[NN.length - 1][i].value;
              if (val > highestP){
                highestP     = val;
                predictedNum = i;
              }
            }
            //this is such a cheat to compare two vectors but whatever LMAO
            if (trainingData[Ndatum].toString() == vectorizeOutput(predictedNum).toString())
              ++numCorrect;

            if (updateConsole)      updateConsoleNow();
            if (updateVisualizer)   updateVisualizerNow();

            Ndatum += 2;
          }

      }
      , 1);
}

document.getElementById("COST").addEventListener("click", showCost);
document.getElementById("TRAIN").addEventListener("click",
  () => {
    scrambleTraining();
    if ( window.confirm("Blur the Training Data?") ){
      var convolutionMatrix = eval(window.prompt("Enter Convolution Matrix (3x3)", "[1/25, 3/25, 1/25, 3/25, 9/25, 3/25, 1/25, 3/25, 1/25]"));
      convolveTraining(convolutionMatrix);
    }
    backPropagate(
      JSON.parse( window.prompt("Cycles: How many cycles of backpropagating all the training data?", "1e4") ),
      JSON.parse( window.prompt("Batch size: How many training samples used to calculate gradient?", "10") ),
      JSON.parse( window.prompt("dX: Multiply gradient by this and subtract it from NN parameters.", "0.01") )
      );
  });