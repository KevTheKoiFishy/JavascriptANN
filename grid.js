var gridWidth = 16, gridHeight = 16;

//make grid
var grid = document.createElement("table");
    document.body.appendChild(grid);
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
grid.addEventListener("mousedown", function(){isMouseDown = true; });
grid.addEventListener("mouseup"  , function(){isMouseDown = false; handleMouseUp();});

function activate(cell){
  if (isMouseDown) {
    cell.className = 'active';
    datagrid[parseInt(cell.id)] = 1;
  }
}

//clear (test.html)
function refreshGrid(){ createGrid(gridWidth, gridHeight) }
document.getElementById("CLEAR").addEventListener("click", refreshGrid);