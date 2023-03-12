var width = 16, height = 16;

//make grid
var grid = document.createElement("table");
    document.body.appendChild(grid);
var datagrid = [];
function createGrid(width, height)
{
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
              cell.setAttribute("onmouseover", "javascript: activate(this);");
      }
  }
}
createGrid(width, height);

//draw, save
var isMouseDown = false;

var data = document.getElementById("exportBox");
grid.addEventListener("mousedown", function(){isMouseDown = true; });
grid.addEventListener("mouseup"  , function(){isMouseDown = false;
                                              
                                              for (var i = 0; i < width*height; ++i){
                                                NN[0].value = datagrid[i];
                                              }
                                              updateNN(NN, nodesByLayer);
                                              
                                              //see output layer
                                              document.getElementById("exportBox").innerText = "";
                                              for (var i = 0; i < NN[NN.length - 1].length; ++i){
                                                var val = NN[NN.length - 1][i].value;
                                                val = Math.round(val * 10000) / 10000;
                                                document.getElementById("exportBox").innerText += val + "\n";
                                              }
                                              
                                              //ID element does not exist in test.html, so the code below applies only to train.html
                                                document.getElementById("exportBox").innerText += document.getElementById("ID").value + ",[" + datagrid + "],\n";
                                                document.getElementById("exportButton").setAttribute("href", "data:text/plain," + document.getElementById("exportBox").innerText);
                                                document.getElementById("exportButton").setAttribute("download", document.getElementById("PJ").value);
                                                createGrid(16, 16);  
                                             });
function activate(cell){
  if (isMouseDown) { cell.className = 'active';   datagrid[parseInt(cell.id)] = 1; }
}