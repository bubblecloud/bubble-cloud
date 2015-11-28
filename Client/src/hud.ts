import * as $ from 'jquery';
import 'bootstrap';
import {ClientEngine} from "../Component/ClientEngine";

$(document).ready(function() {
    if (document.getElementById("renderCanvas")) {
        var engine: ClientEngine = new ClientEngine();
        engine.startup();

        setInterval(function() {
            engine.loop();
        }, 300);
    }
});

$(document).on('contextmenu', function(e) {
    if ($(e.target).is("#renderCanvas"))
        return false;

});

export class App {
    message: string = 'Welcome to Aurelia!';

}
