var numLayers  = 4;
var numNeurons = [datagrid.length, 16, 16, 10];
var NN = [];
var values = [datagrid];

var layer = 0;

for (layer = 1; layer < numLayers; ++layer)
{
  NN.push([]);
  for (var neuron = 0; neuron < numNeurons[layer]; ++neuron)
  {
    NN[layer].push([Math.Random(), Math.Random()])
  }
}