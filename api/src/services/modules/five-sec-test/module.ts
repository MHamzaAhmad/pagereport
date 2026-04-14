import {
	FIVE_SEC_TEST_MODULE_TYPE,
	fiveSecTestResultSchema,
} from "@/services/modules/five-sec-test/result.schema";
import { runFiveSecTest } from "@/services/modules/five-sec-test/runner";
import { registerModule } from "@/services/modules/registry";

registerModule({
	type: FIVE_SEC_TEST_MODULE_TYPE,
	resultSchema: fiveSecTestResultSchema,
	run: runFiveSecTest,
});
