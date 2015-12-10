
export class MaterialRegister {

    private materials: {[key: string]: {[key: string]: BABYLON.Material}} = {};

    constructor() {

    }

    add(repository: string, material: BABYLON.Material): void {
        if (!this.materials[repository]) {
            this.materials[repository] = {};
        }
        this.materials[repository][material.name] = material;
        console.log('Registered material: ' + repository + ' / ' + material.name);
    }

    remove(repository: string, material: BABYLON.Material): void {
        if (this.materials[repository]) {
            delete this.materials[repository][material.name];
        }
        console.log('De-registered material: ' + repository + ' / ' + material.name);
    }

    get(repository: string, name: string): BABYLON.Material {
        if (this.materials[repository]) {
            return this.materials[repository][name];
        } else {
            return null;
        }
    }
}