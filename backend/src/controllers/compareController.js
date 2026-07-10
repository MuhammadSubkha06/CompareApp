import { runCompare } from "../services/compareService";

export async function compareFiles(body) {
    return await runCompare(body);
}
