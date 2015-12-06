import {ContentModule} from "../../components/ContentModule";
import {ClientEngine} from "../../components/ClientEngine";
import {Primitive} from "./Primitive";

export class CommonModule implements ContentModule {

    repository:string = 'default';

    load(engine:ClientEngine): void {
        engine.actuatorRegister.add(new Primitive());
    }

    unload(engine:ClientEngine): void {
        engine.actuatorRegister.remove(new Primitive());
    }

}