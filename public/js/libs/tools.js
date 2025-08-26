/** @deprecated Please for the new codebase use the tools functions created in typescript */
var tools = new Object();

tools.random = function (a, b) {
  return Math.round(Math.random() * (b - a) + parseInt(a));
};

tools.arrEqual = function (a, b, type = "Equal") {
  if (type == "Equal") {
    if (a.length != b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      let tempArr1 = a[i];
      let tempArr2 = b[i];

      let tempArr1Inst = typeof tempArr1;
      let tempArr2Inst = typeof tempArr2;

      if (tempArr1Inst == "object" && tempArr1Inst == tempArr2Inst) {
        let tempCompareObj = this.objEqual(tempArr1, tempArr2);

        if (tempCompareObj == false) {
          return false;
        }
      } else if (tempArr1 != tempArr2) {
        return false;
      }
    }

    return true;
  } else if (type == ">") {
    let tempArr1 = 0;
    let tempArr2 = 0;

    for (let i = 0; i < a.length; i++) {
      tempArr1 += a[i];
      tempArr2 += b[i];

      if (tempArr1 > tempArr2) {
        return true;
      }
    }

    return false;
  }
};

tools.objEqual = function (a, b) {
  let aProperties = [];
  let bProperties = [];

  for (const key in a) {
    if (a.hasOwnProperty(key)) {
      aProperties.push(key);
    }
  }

  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      bProperties.push(key);
    }
  }

  if (aProperties.length != aProperties.length) {
    return false;
  }

  for (let i = 0; i < aProperties.length; i++) {
    let tempPropertyName = aProperties[i];
    if (a[tempPropertyName] !== b[tempPropertyName]) {
      return false;
    }
  }

  return true;
};

tools.objClone = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

//--------------------
