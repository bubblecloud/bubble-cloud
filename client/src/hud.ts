import * as $ from 'jquery';
import 'bootstrap';
import 'babylonjs';

import {ClientEngine} from "./components/ClientEngine";

var globalClientEngine: ClientEngine;

$(document).ready(function() {
    if (document.getElementById("renderCanvas")) {
        globalClientEngine = new ClientEngine();
        globalClientEngine.startup();

        setInterval(function() {
            globalClientEngine.loop();
        }, 300);
    }
});

$(document).on('contextmenu', function(e) {
    if ($(e.target).is("#renderCanvas"))
        return false;

});

export class App {
    message: string = 'Welcome to Aurelia!';

    getClientEngine(): ClientEngine {
        return globalClientEngine;
    }
}
