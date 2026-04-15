import {
	LIGHTHOUSE_MODULE_TYPE,
	lighthouseResultSchema,
} from "@/services/modules/lighthouse/result.schema";
import { runLighthouse } from "@/services/modules/lighthouse/runner";
import { registerModule } from "@/services/modules/registry";

registerModule({
	type: LIGHTHOUSE_MODULE_TYPE,
	resultSchema: lighthouseResultSchema,
	run: runLighthouse,
});
