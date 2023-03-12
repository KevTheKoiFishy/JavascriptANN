var visual = document.createElement("DIV");
    gridContainer.appendChild(visual);
    for (var Nlayer = 0; Nlayer < nodesByLayer.length; ++Nlayer){
        var thisLayer = visual.appendChild(document.createElement("DIV"));
            thisLayer.id = "L" + Nlayer;
        for (var Nnode = 0; Nnode < nodesByLayer[Nlayer]; ++Nnode){
            var thisNode = thisLayer.appendChild(document.createElement("SPAN"));
                thisNode.id = "L" + Nlayer + "_N" + Nnode;
                thisNode.innerText = Nnode;
        }
    }