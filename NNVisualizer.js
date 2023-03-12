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
                if (nodesByLayer[Nlayer] < 50){
                  thisNode.innerText = Nnode;
                } else {
                  
                }
        }
    }