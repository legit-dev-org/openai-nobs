import { EditGet, IEditData, IEditRequest } from "../Edits";
import { GenericSession } from "./GenericSession";

export interface IEditsSessionRequest extends Omit<IEditRequest, "model"> {
    model?: string;
}

/*
 * The EditsSession class provides a utility layer on top of the raw OpenAI API for ease of use.
 * Specific benefits over the raw API include:
 *  - Automatically finding an available model to use
 *  - Automatically moderating input via the Moderations endpoint
*/
export class EditsSession extends GenericSession {
    public async edit(request: IEditsSessionRequest): Promise<IEditData> {
        if (this._options.autoModeration) {
            await this.moderator.checkModerations([request.input ?? "", request.instruction]);
        }

        return this.client.makeRequest(new EditGet({
            ...request,
            model: await this.modelFetcher.requireModelId(request.model, "edits")
        }));
    }
}
