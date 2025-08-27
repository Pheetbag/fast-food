//this will be an experimental engine on the game, the task for it will be to render any element in the place is needed using cicleUpdate for it.
//We are going to use this engine to draw elements into the game, so for example this will allow us to have an updated money box in more than one place at the same thing, using the same code, and not defining a new system for it.

function Paint() {
    Paint.prototype.getContext = function (context, type = "class") {
        let tempContext = [];

        if (type == "id") {
            tempContext.push(document.getElementById(context));
        } else if (type == "class") {
            tempContext = document.getElementsByClassName(context);
        }

        return tempContext;
    };

    Paint.prototype.filter = function (sketch, filter) {
        //we start looking for elements by selectors.
        let tempElementsTag = [];
        let tempElementsClass = [];
        let tempElementsId = [];

        if (!(filter.tag == "*")) {
            filter.tag = filter.tag.toLowerCase();
            for (let i = 0; i < sketch.length; i++) {
                let tempTag = sketch[i].tagName.toLowerCase();
                if (tempTag == filter.tag) {
                    tempElementsTag.push(sketch[i]);
                }
            }
        } else {
            tempElementsTag = sketch;
        }

        if (!(filter.class == "*")) {
            for (let i = 0; i < tempElementsTag.length; i++) {
                let tempClass = tempElementsTag[i].classList;
                let pointer = i;
                for (let i = 0; i < tempClass.length; i++) {
                    let tempClassItem = tempClass[i];
                    if (tempClassItem == filter.class) {
                        tempElementsClass.push(tempElementsTag[pointer]);
                    }
                }
            }
        } else {
            tempElementsClass = tempElementsTag;
        }

        if (!(filter.id == "*")) {
            for (let i = 0; i < tempElementsClass.length; i++) {
                let tempId = tempElementsClass[i].id;
                if (tempId == filter.id) {
                    tempElementsId.push(tempElementsClass[i]);
                }
            }
        } else {
            tempElementsId = tempElementsClass;
        }

        return tempElementsId;
    };

    Paint.prototype.stroke = function (sketch, stroke) {
        for (let i = 0; i < stroke.length; i++) {
            let tempStroke = stroke[i];
            //if(tempStroke[0].toLowerCase() == 'style'){continue;}

            for (let i = 0; i < sketch.length; i++) {
                sketch[i].setAttribute(tempStroke[0], tempStroke[1]);
            }
        }
    };

    Paint.prototype.brush = function (sketch, brush) {
        for (let i = 0; i < sketch.length; i++) {
            if (brush.color !== null) {
                sketch[i].style.color = brush.color;
            }

            if (brush.fontFamily !== null) {
                sketch[i].style.fontFamily = brush.fontFamily;
            }

            if (brush.fontWeight !== null) {
                sketch[i].style.fontWeight = brush.fontWeight;
            }

            //-----------------

            if (brush.cursor !== null) {
                sketch[i].style.cursor = brush.cursor;
            }

            //-----------------

            if (brush.margin !== null) {
                sketch[i].style.margin = brush.margin;
            }

            if (brush.padding !== null) {
                sketch[i].style.padding = brush.padding;
            }

            //-----------------

            if (brush.margin !== null) {
                sketch[i].style.margin = brush.margin;
            }

            if (brush.padding !== null) {
                sketch[i].style.padding = brush.padding;
            }

            //-----------------

            if (brush.background !== null) {
                sketch[i].style.background = brush.background;
            }

            if (brush.backgroundColor !== null) {
                sketch[i].style.backgroundColor = brush.backgroundColor;
            }

            if (brush.backgroundImage !== null) {
                sketch[i].style.backgroundImage = brush.backgroundImage;
            }

            if (brush.backgroundPosition !== null) {
                sketch[i].style.backgroundPosition = brush.backgroundPosition;
            }

            if (brush.backgroundSize !== null) {
                sketch[i].style.backgroundSize = brush.backgroundSize;
            }

            if (brush.backgroundRepeat !== null) {
                sketch[i].style.backgroundRepeat = brush.backgroundRepeat;
            }

            //-----------------

            if (brush.opacity !== null) {
                sketch[i].style.opacity = brush.opacity;
            }

            // ---------------

            if (brush.visibility !== null) {
                sketch[i].style.visibility = brush.visibility;
            }

            //-----------------

            if (brush.width !== null) {
                sketch[i].style.width = brush.width;
            }

            if (brush.height !== null) {
                sketch[i].style.height = brush.height;
            }

            //-----------------

            if (brush.display !== null) {
                sketch[i].style.display = brush.display;
            }
        }
    };

    Paint.prototype.sketch = function (elements) {
        let tempSketch = [];

        for (let i = 0; i < elements.length; i++) {
            tempSketch.push(document.createElement(elements[i]));
        }

        return tempSketch;
    };

    Paint.prototype.draw = function (sketch, context) {
        //we create context.length copys of the sketchs nodes, so every contesxt will have applied different nodes.

        let sketchMap = [];
        let pointer = 0;

        for (let i = 0; i < context.length; i++) {
            let tempSketch = [];

            for (let i = 0; i < sketch.length; i++) {
                tempSketch.push(sketch[i].cloneNode(false));
            }

            sketchMap.push(tempSketch);
        }

        //We actually draw the sketch into the context, if we have more than one context the nodes of the original sketch will be multiplied by the quantity of context we have. So we have nodes for every context

        let paintedContext = [];

        for (let i = 0; i < context.length; i++) {
            let paintedSketch = [];

            let tempContext = context[i];
            let fragmentContext = document.createDocumentFragment();

            for (let i = 0; i < sketchMap[pointer].length; i++) {
                let drawedNode = fragmentContext.appendChild(
                    sketchMap[pointer][i],
                );

                paintedSketch.push(drawedNode);
            }

            tempContext.appendChild(fragmentContext);

            paintedContext.push(paintedSketch);

            pointer++;
        }

        return paintedContext;
    };

    Paint.prototype.erase = function (context) {
        for (let i = 0; i < context.length; i++) {
            let tempContext = context[i];
            let tempChilds = tempContext.children;

            for (let i; 0 < tempChilds.length; i) {
                tempContext.removeChild(tempChilds[0]);
            }
        }
    };
}

// BASE OBJECTS -------------------------------------

function PaintFilter() {
    this.tag = "*";
    this.class = "*";
    this.id = "*";
}

function PaintBrush() {
    this.color = null;
    this.fontFamily = null;
    this.fontWeight = null;

    this.cursor = null;

    this.margin = null;
    this.padding = null;

    this.background = null;
    this.backgroundColor = null;
    this.backgroundPosition = null;
    this.backgroundImage = null;
    this.backgroundSize = null;
    this.backgroundRepeat = null;

    this.opacity = null;

    this.minWidth = null;
    this.width = null;
    this.minHeight = null;
    this.height = null;

    this.display = null;

    this.visibility = null;

    this.position = null;
    this.top = null;
    this.bottom = null;
    this.left = null;
    this.right = null;

    this.border = null;
    this.borderRadius = null;
    this.borderRight = null;
    this.borderLeft = null;
    this.borderBottom = null;
    this.borderTop = null;
}
