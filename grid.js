var gridWidth = 16, gridHeight = 16;

//make grid
var gridContainer = document.getElementById("gridContainer");
var grid = document.createElement("table");
    gridContainer.appendChild(grid);
var datagrid = [];
function createGrid(width, height){
    datagrid = [];
    grid.innerHTML = "";

    for (var y = 0; y < height; ++y){
        var row = document.createElement("tr");
            grid.appendChild(row);
        for (var x = 0; x < width; ++x){
            var cell = document.createElement("td");
                datagrid.push(0);
                row.appendChild(cell);
                cell.id = width * y + x;
                cell.className = "inactive";
                cell.setAttribute("onmouseover", "javascript: activate(this); displayUpdatedNN();");
        }
    }
}
createGrid(gridWidth, gridHeight);

//draw, save
var isMouseDown = false;
grid.addEventListener("mousedown", handleMouseDown);
grid.addEventListener("mouseup"  , handleMouseUp);

function activate(cell){
  if (isMouseDown) {
    cell.className = 'active';
    datagrid[parseInt(cell.id)] = 1;
  }
}

//clear (test.html)
function refreshGrid(){ createGrid(gridWidth, gridHeight) }
document.getElementById("CLEAR").addEventListener("click", refreshGrid);

//handle console and visuals
function 

function displayUpdatedNN(){
  for (var i = 0; i < gridWidth*gridHeight; ++i)
    NN[0][i].value = datagrid[i];
  updateNN(NN, nodesByLayer);

  if (updateConsole){
      
    
  }

  if (updateVisualizer){
      for (var Nlayer = 0; Nlayer < nodesByLayer.length; ++Nlayer){
          for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
              var percent = Math.round(NN[Nlayer][Nnode].value*10000)/100;
              document.getElementById("L"+Nlayer+"_N"+Nnode).setAttribute("style", "background: linear-gradient(0deg, #9037a3 0%, #9037a3 " + percent + "%, #ecf0f8 " + percent + "%, #ecf0f8 100%);");
              document.getElementById("L"+Nlayer+"_N"+Nnode).setAttribute("activation", NN[Nlayer][Nnode].value);
          }
      }
  }

}