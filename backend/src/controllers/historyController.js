import { listHistory, getHistoryDetail } from "../services/historyService";

export async function getHistoryListController() {
    return await listHistory();
}

export async function getHistoryDetailController(id) {
    return await getHistoryDetail(id);
}
