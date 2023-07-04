
//display each neuron's activation when hovered
var altText = document.getElementById("altText");

//generate nn visual
var visual = document.createElement("DIV");
    gridContainer.appendChild(visual);
    visual.id = "NNVisual";
    for (var Nlayer = 0; Nlayer < nodesByLayer.length; ++Nlayer){
        var thisLayer = visual.appendChild(document.createElement("DIV"));
            thisLayer.id = "L" + Nlayer;
            thisLayer.align = "center";
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            var thisNode = thisLayer.appendChild(document.createElement("DIV"));
                thisNode.id = "L" + Nlayer + "_N" + Nnode;
                thisNode.addEventListener("mouseover",
                    function(){
                        altText.style.display = "block";
                        altText.style.left = event.clientX;
                        altText.style.top = event.clientY;
                        altText.innerText = this.getAttribute("activation");
                    }
                );
                thisNode.addEventListener("mouseout",
                    function(){
                        altText.style.display = "none";
                    }
                );
        }
    }

//handle console and visual updates
  var Ndatum, costValue, averageCostValue;
  var outBox = document.getElementById("exportBox");
  function updateConsoleNow(){
    //see output layer
    outBox.innerText = "";
    outBox.innerText += datagrid + "\n";


    outBox.innerText += "Sample No." + (Ndatum/2 + 1) + "\n";
    outBox.innerText += "Cost: "     + costValue + "\n";
    outBox.innerText += "Avg Cost: " + averageCostValue + "\n";

    //simple miniMax function determines output
    highestP     = 0;
    predictedNum = 0;
    for (var i = 0; i < NN[NN.length - 1].length; ++i){
      var val = NN[NN.length - 1][i].value;
      outBox.innerText += "P(" + i + "): " + val + "\n";
      if (val > highestP){
        highestP     = val;
        predictedNum = i;
      }
    }

    outBox.innerText += "PREDICTION: " + predictedNum + "\n";
    outBox.innerText += "ACCURACY: " + numCorrect + "/" + (Ndatum/2) + " = " + (numCorrect/Ndatum * 2);
  }
  function updateVisualizerNow(){
    for (var Nlayer = 0; Nlayer < nodesByLayer.length; ++Nlayer){
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            var percent = Math.round(NN[Nlayer][Nnode].value*10000)/100;
            document.getElementById("L"+Nlayer+"_N"+Nnode).setAttribute("style", "background: linear-gradient(0deg, #9037a3 0%, #9037a3 " + percent + "%, #ecf0f8 " + percent + "%, #ecf0f8 100%);");
            document.getElementById("L"+Nlayer+"_N"+Nnode).setAttribute("activation", NN[Nlayer][Nnode].value);
        }
    }
  }
function displayUpdatedNN(){
  updateNN(datagrid);

  if (updateConsole)      updateConsoleNow();
  if (updateVisualizer)   updateVisualizerNow();

}