//make gltich.com compiler stop screaming
var trainingData, NN, gridWidth, gridHeight, updateNN, nodesByLayer,
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
function convolveTraining(convolutionMatrix){
  var convolvedTrainingData = [];
  
  
  for (var Y = 0; Y < gridHeight; ++Y){
    for (var X = 0; X < gridWidth; ++X){
  /*
      var thisMatrix = convolutionMatrix;
      
      //zero weights when edge touching
      // if (X == 0)              thisMatrix[0] = 0; thisMatrix[3] = 0; thisMatrix[6] = 0;
      // if (Y == 0)              thisMatrix[0] = 0; thisMatrix[1] = 0; thisMatrix[2] = 0;
      // if (X == gridWidth - 1)  thisMatrix[2] = 0; thisMatrix[5] = 0; thisMatrix[8] = 0;
      // if (Y == gridHeight - 1) thisMatrix[6] = 0; thisMatrix[7] = 0; thisMatrix[8] = 0;
      
      for (var i = 0; i < convolutionMatrix.length; ++i){
        var convolveCellX = i%3 - 1;
        var convolveCellY = Math.floor(i/3) - 1;
        
        //if out of bounds, return 0; else, return training data value;
        var dataAtConvolveCell =
            (
               convolveCellX < 0
            || convolveCellX > gridWidth - 1
            || convolveCellY < 0
            || convolveCellY < gridHeight - 1
            )
            ? 0 : trainingData[ (X + convolveCellX) + gridWidth*(Y + convolveCellY) ];
        
        convolvedTrainingData[X + gridWidth * Y] += dataAtConvolveCell * convolutionMatrix[i];
      }
    }
  }
  */
  //instead of checking if the convolution matrix goes out of bounds and then
  //returning 0 if it does, simply do not use the out of bounds cases!
  
  for (var Y = 1; Y < gridHeight-1; ++Y){
    for (var X = 1; X < gridWidth-1; ++X){
      var thisMatrix = convolutionMatrix;
      
      //zero weights when edge touching
      // if (X == 0)              thisMatrix[0] = 0; thisMatrix[3] = 0; thisMatrix[6] = 0;
      // if (Y == 0)              thisMatrix[0] = 0; thisMatrix[1] = 0; thisMatrix[2] = 0;
      // if (X == gridWidth - 1)  thisMatrix[2] = 0; thisMatrix[5] = 0; thisMatrix[8] = 0;
      // if (Y == gridHeight - 1) thisMatrix[6] = 0; thisMatrix[7] = 0; thisMatrix[8] = 0;
      
      for (var i = 0; i < convolutionMatrix.length; ++i){
        var convolveCellX = i%3 - 1;
        var convolveCellY = Math.floor(i/3) - 1;
        
        //if out of bounds, return 0; else, return training data value;
        var dataAtConvolveCell =
            (
               convolveCellX < 0
            || convolveCellX > gridWidth - 1
            || convolveCellY < 0
            || convolveCellY < gridHeight - 1
            )
            ? 0 : trainingData[ (X + convolveCellX) + gridWidth*(Y + convolveCellY) ];
        
        convolvedTrainingData[X + gridWidth * Y] += dataAtConvolveCell * convolutionMatrix[i];
      }
    }
  }
  
  trainingData = convolvedTrainingData;
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
            for (var i = 0; i < nodesByLayer[0]; ++i)
              if (displayGrid){document.getElementById(i).setAttribute("style", "background: rgba(235, 27, 110, " + trainingData[Ndatum + 1][i]*100 + "%);");}
              //if (displayGrid){document.getElementById(i).className = (trainingData[Ndatum + 1][i] ? "active" : "inactive");}

            updateNN(trainingData[Ndatum + 1]);

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

      }, 1);
}

document.getElementById("COST").addEventListener("click", showCost);
document.getElementById("TRAIN").addEventListener("click",
  () => {
    scrambleTraining();
    if ( window.confirm("Blur the Training Data?") ){
      var convolutionMatrix = JSON.parse(window.prompt("Enter Convolution Matrix (3x3)", "[1/25, 3/25, 1/25, 3/25, 9/25, 3/25, 1/25, 3/25, 1/25]"));
      convolveTraining(convolutionMatrix);
    }
    backPropagate(
      JSON.parse( window.prompt("Cycles: How many cycles of backpropagating all the training data?", "1e4") ),
      JSON.parse( window.prompt("Batch size: How many training samples used to calculate gradient?", "10") ),
      JSON.parse( window.prompt("dX: Multiply gradient by this and subtract it from NN parameters.", "0.01") )
      );
  });