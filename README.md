
# IMSorter
A simple imports sorter according to your taste!

IMSorter reads a config file and searches for all ```imports``` in the active document and collects and sorts them on top of it.

### **Demo:**


<br/>

**Note 1:** IMSorter currently is suitable for ```import``` lines in these shapes: 

```javascript
import { a } from "lib"
```
```javascript
import a from "lib"
```
```javascript
import * as a from "lib"
```
```javascript
import {
    a, b
} from "lib"
```
```
...
```

**Note 2:** ```require``` not supprted.

<br/>

### **Usage**: 

1- Install IMSorter.

2- Add **imsorter.json** (config file) in root and configur it.

3- Open a file you want to sort ```imports```,

4- Open command pallet (ctrl+shift+p) and enter **IMSorter**.

5- WoW!

<br/>

### **Setting Config File:**

Add all or some of ```import``` directory in order you want, like this: 

```json
{
    importsKey: [
        "react",         //order 1
        "axios",         //order 2
        "./api"          //order 3
        "../components"  //order 4
        "@/assets/img"   //order 5
    ]
}
```
<br/>

### **Example:**

These ```imports```:
```js
import line1 from @/assets/img/lines-1.png";
import React, { useEffect, useState } from "react";
import { IconButton } from "../components/buttons/IconButton";
import line2 from "@/assets/img/lines-2.png";
import axios from "axios";
import { IconInput } from "../components/Inputs/IconInput";
```

Sorted To:
```js
import React, { useEffect, useState } from "react";

import axios from "axios";

import { IconButton } from "../components/buttons/IconButton"
import { IconInput } from "../components/Inputs/IconInput"

import line1 from @/assets/img/lines-1.png";
import line2 from "@/assets/img/lines-2.png";
```
