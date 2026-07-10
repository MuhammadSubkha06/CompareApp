import {
    dashboardSummary
}
from "../services/dashboardService";

export async function getDashboard(){

    return await dashboardSummary();

}