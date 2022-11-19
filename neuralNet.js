var datagrid;
var numLayers  = 4;
var numValues = [datagrid.length, 16, 16, 10];
var NN = [];
var values = [datagrid];

var layer = 0;

for (layer = 1; layer < numLayers; ++layer){
  NN[layer] = [];
  datagrid[layer] = []
  for (var val = 0; val < numValues[layer]; ++val){
    NN[layer][val] = [];
    datagrid[layer][val] = [];
    for (var input = 0; input < numValues[layer-1]; ++input){
      NN[layer][val][input] = [Math.random(), Math.random()];
    }
  }
}

console.log(NN);