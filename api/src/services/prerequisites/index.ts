import "@/services/prerequisites/page-scrape/prerequisite";
import "@/services/prerequisites/page-intelligence/prerequisite";
import "@/services/prerequisites/copy-outline/prerequisite";

export type {
	Prerequisite,
	PrerequisiteResults,
	PrerequisiteRunContext,
	PrerequisiteRunInput,
	PrerequisiteRunWorkflowParams,
} from "@/services/prerequisites/registry";
export {
	getPrerequisite,
	listPrerequisites,
	makePrerequisiteResults,
	registerPrerequisite,
} from "@/services/prerequisites/registry";
