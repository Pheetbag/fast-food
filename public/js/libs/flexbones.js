//Flexbones is an experimental engine that take cares of drawing elements into the game canvas, using a context for it.
//This engine will work distint to the old paint system, that have a set functions that let the system works around a set of elements passed as parameters. This time we will use a system similar to jquery creating an sketch object that can use a set of methods to act around it

/**
 * @deprecated This has been replaced for a modern implementation in typescript and with a simpler api, refer to the flexbones.ts file
 */
function flexbones(xMap) {
    if (!Array.isArray(xMap)) {
        xMap = [xMap];
    }

    return new Flexbones(xMap);
}

function Flexbones(xMap) {
    this.x = document.createDocumentFragment();
    this.context = document.body;
    this.primitive = xMap;

    this.copy = null;

    /** @type any */
    this.sketch = function () {
        this.x = document.createDocumentFragment();

        self = this;
        xMap = this.primitive;

        for (var i = 0; i < xMap.length; i++) {
            //This is an item of the matrix it can be an xObject or an treeArray
            evalArrayItem(xMap[i]);
        }

        //This take care of detect if a matrix item is an xObject or a TreeArray, in case is a TreeArray call the corresponding functions
        function evalArrayItem(item, parent = self.x) {
            //We check if the item is an array, if it is, es a treeArray otherwhise is an xObject (or a textnode, this will be validated in xObjectAction)
            if (Array.isArray(item)) {
                treeArrayAction(item, parent);
            } else {
                xObjectAction(item, parent);
            }
        }

        //This will take care of make the corresponding actions when and xObject is detected.

        function xObjectAction(xObject, parent = self.x) {
            let type = typeof xObject;
            let element;
            if (type === "string" || type === "number" || type === "boolean") {
                element = document.createTextNode(xObject);
            } else if (typeof xObject === "object") {
                element = xObjectCreate(xObject);
            }
            parent.appendChild(element);
        }

        //This will take care of make the corresponding actions when and TreeArray is detected.
        function treeArrayAction(treeArray, parent = self.x) {
            if (treeArray.length == 1) {
                xObjectAction(treeArray[0], parent);
                return;
            }

            //We use treeArray[0] for creating the parent object that will contain all others
            let tempParent = xObjectCreate(treeArray[0]);

            for (var i = 1; i < treeArray.length; i++) {
                const item = treeArray[i];
                evalArrayItem(item, tempParent);
            }

            parent.appendChild(tempParent);
            tempParent = parent;
        }

        function xObjectCreate(xObject) {
            const properties = Object.entries(xObject);
            const element = document.createElement(xObject.x);

            for (var i = 0; i < properties.length; i++) {
                if (properties[i][0] == "x") {
                    continue;
                }
                element.setAttribute(properties[i][0], properties[i][1]);
            }
            return element;
        }

        return this;
    };

    /** @type any */
    this.select = function (selector) {
        this.context = document.querySelectorAll(selector);

        return this;
    };

    /** @type any */
    this.contextualize = function (context) {
        this.context = context;
        return this;
    };

    this.clear = function () {
        const context = this.context;

        for (let i = 0; i < context.length; i++) {
            let tempContext = context[i];
            let tempChilds = tempContext.childNodes;

            for (let i; 0 < tempChilds.length; i) {
                tempContext.removeChild(tempChilds[0]);
            }
        }

        return this;
    };

    this.bind = function (firstElement = false) {
        this.sketch();

        const context = this.context;

        if (firstElement === true) {
            for (let i = 0; i < context.length; i++) {
                tempX = this.x.cloneNode(true);
                this.context.insertBefore(tempX, this.context.firstChild);
            }
        } else {
            for (let i = 0; i < context.length; i++) {
                const tempX = this.x.cloneNode(true);
                context[i].appendChild(tempX);
            }
        }

        return this;
    };
}

/*
Base estructure for sketchMap
the start for the sketchMap is the matrix array, it contain the whole structure, this works with a syntax similar to JSx.

Inside the matrix array you will be able to define the most basic definition, and xObject, a very flexible object structure that will be transformed into the DOM object. This object use the "x" index to define the tag name that will be created in that position.


The hello work structure define the matrix array, with a basic xObject inside.You can expánd this syntax as far as you wish to, separating every xObject as in an usual array.

[
   {x: 'div'},
   {x: 'h1'},
   {x: 'header'}
]

return:

<div></div>
<h1></h1>
<header></header>

if you want to create more complex structures you can start using the Tree Array, the system process the matrix array as a container for the sketch structure, but any other array inside it as a Tree array, this structure define how you can set childs xObjects inside others xObjects. When an array is detected the system will handle the xObject in the index 0, as the parent, and any other inside that array will be a first-level child of that parent. You can nest TreeArrays infinitly.

[
   {x: 'div'},
   [
   {x: 'header'},
      {x: 'h1'},
      [
      {x: 'div'},
         {x: 'p'}
      ],
      {x: 'div'}
   ]
]

return:

<div></div>
<header>
   <h1></h1>
   <div>
      <p></p>
   </div>
   <diV></div>
</header>

We also support the creation of textNodes, so if we detect something that is not an xObject but an string we will transform it into a textNode, so you can fill up the structure with, having freedom for it.

[
   [
   {x: 'p'},
      'Hello World!'
   ]
]

return:

<p>
   Hello World!
</p>

Finally if you define an xObject and whant to declare a couple of properties into it, you can define it easy, like if you were dealing with an html tag, so just define the property name and the value and it will be set into the xObject when sketched.

[
   {x: 'header', 'id': 'header-nav', 'name': 'header-main', 'class': 'head primary tab'}
]

return:

<header id="header-nav" name="header-main" class="head primary tab">
</header>

You can tryout this full example an experiment with it:

xMap = [
   {x: 'div'},
   [
   {x: 'header', 'id': 'header-nav', 'name': 'header-main', 'class': 'head primary tab'},
      {x:'h1'},
      [
      {x: 'map'},
         {x: 'div'},
         [
         {x: 'span'},
            {x: 'div'},
            {x: 'div'}
         ],
         {x: 'canvas'}
      ],
      {x: 'footer'},
      [{x: 'form'}],
      [
      {x: 'p'},
         'Hello World!',
         {x: 'div'},
         'LoremIpsum'
      ]
   ],
   {x: 'br'},
   [{x: 'hr'}]
];
*/
