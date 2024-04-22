
# IMSorter
A simple imports sorter according to your taste!

IMSorter reads a configuration file and searches for all ```import``` statements in the active document, then collects and sorts them at the beginning of the active document.

<br/>

**Note 1:** IMSorter currently supports ```import``` statements in the following formats:

```javascript
import { a } from "lib"
import a from "lib"
import * as a from "lib"
import {
    a, b
} from "lib"
...
```

**Note 2:** ```require``` statements are not currently supported.

<br/>

### **Usage**: 

1- Install IMSorter.

2- Add an ***imsorter.json*** configuration file in the root directory of your project.

3- Open the file you want to sort ```imports``` in.

4- Open the command palette (Ctrl+Shift+P) and enter ***IMSorter***.

5- WoW!

<br/>

### **Configuration File Setup:**

The IMSorter config file is a JSON object with an "importsKey" array. Add directories/libraries in the desired order, like this:

```json
{
    "importsKey": [
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
import line1 from "@/assets/img/lines-1.png";
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

import line1 from "@/assets/img/lines-1.png";
import line2 from "@/assets/img/lines-2.png";
```
