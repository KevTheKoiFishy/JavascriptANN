var gridWidth = 16, gridHeight = 16;
var gridLength = 

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

//clear
// function refreshGrid(){ createGrid(gridWidth, gridHeight) }
// document.getElementById("CLEAR").addEventListener("click", refreshGrid);
function initDataGrid() { datagrid = []; for (var Ncell = 0; Ncell < gridWidth * gridHeight)}
function refreshGrid(){ displayUpdatedNN(); }
document.getElementById("CLEAR").addEventListener("click", refreshGrid);