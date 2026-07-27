import type { EditTarget } from './EditTarget'

export class EditingSession {
    private target: EditTarget | null = null

    public begin(target: EditTarget) {
        this.target = target
    }

    public end() {
        this.target = null
    }

    public getTarget() {
        return this.target
    }

    public isEditing() {
        return this.target !== null
    }
}
