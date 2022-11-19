var datagrid = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var numLayers  = 4;
var numValues = [datagrid.length, 16, 16, 10];
var NN = [];
var values = [datagrid];

var layer = 0;

//make
for (layer = 1; layer < numLayers; ++layer){
  NN[layer] = [];
  values[layer] = []
  for (var val = 0; val < numValues[layer]; ++val){
    NN[layer][val] = [];
    values[layer][val] = 0;
    for (var input = 0; input < numValues[layer-1]; ++input){
      NN[layer][val][input] = [Math.random()/numValues[layer-1], Math.random()];
    }
  }
}

//run
for (layer = 1; layer < numLayers; ++layer){
  for (var val = 0; val < numValues[layer]; ++val){
    for (var input = 0; input < numValues[layer-1]; ++input){
      if (values[layer][val] > NN[layer][val][input][1]){
        values[layer][val] += (values[layer-1][input] - NN[layer][val][input][1]) * NN[layer][val][input][0];
} } } }

console.log(values);