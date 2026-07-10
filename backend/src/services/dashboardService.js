import { getDashboardSummary } from "../repositories/dashboardRepository";

export async function dashboardSummary() {
    return await getDashboardSummary();
}