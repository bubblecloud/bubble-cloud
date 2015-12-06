import Vector3 = BABYLON.Vector3;
import Quaternion = BABYLON.Quaternion;

/**
 * Grid implementation for snap transformations to grid.
 */
export class ClientGrid {
    positionStep: number = 0.2;
    positionOffset: number = 0;
    rotationStep: number = 1;
    rotationOffset: number = 0;
    scaleStep: number = 0.1;
    scaleOffset: number = 0;

    /**
     * Snaps position to grid.
     * @param position the position
     * @returns {BABYLON.Vector3} snapped position
     */
    positionSnap(position: Vector3): Vector3 {
        return new Vector3(
            this.snap(position.x, this.positionStep, this.positionOffset),
            this.snap(position.y, this.positionStep, this.positionOffset),
            this.snap(position.z, this.positionStep, this.positionOffset)
        );
    }

    /**
     * Snaps rotation to grid.
     * @param rotationQuaternion the rotation
     * @returns {Quaternion} snapped rotation
     */
    rotationSnap(rotationQuaternion: Quaternion): Quaternion {
        var rotation: Vector3 = rotationQuaternion.toEulerAngles();
        var snappedRotation: Vector3 = new Vector3(
            this.snap(rotation.x, this.rotationStep, this.rotationOffset),
            this.snap(rotation.y, this.rotationStep, this.rotationOffset),
            this.snap(rotation.z, this.rotationStep, this.rotationOffset)
        );
        return Quaternion.RotationYawPitchRoll(snappedRotation.y, snappedRotation.x, snappedRotation.z);
    }

    /**
     * Snap scale to grid.
     * @param scale the scale
     * @returns {BABYLON.Vector3} the snapped scale
     */
    scaleSnap(scale: Vector3): Vector3 {
        return new Vector3(
            this.snap(scale.x, this.scaleStep, this.scaleOffset),
            this.snap(scale.y, this.scaleStep, this.scaleOffset),
            this.snap(scale.z, this.scaleStep, this.scaleOffset)
        );
    }

    /**
     * Helper method for snapping single values to step and offset.
     * @param value the value
     * @param step the step
     * @param offset the offset
     * @returns {number} the snapped value
     */
    private snap(value: number, step: number, offset: number): number {
        return Math.round((value - offset) / step) * step + offset;
    }

}