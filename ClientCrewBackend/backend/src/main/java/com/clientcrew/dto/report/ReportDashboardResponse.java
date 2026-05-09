package com.clientcrew.dto.report;

import java.util.List;

public class ReportDashboardResponse {

    private String role;

    private ReportSummaryResponse summary;

    private List<ReportChartResponse> taskStatusChart;

    private List<ReportChartResponse> projectStatusChart;

    private List<ReportChartResponse> productivityChart;

    private List<ReportActivityResponse> recentActivities;

    public ReportDashboardResponse() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public ReportSummaryResponse getSummary() {
        return summary;
    }

    public void setSummary(ReportSummaryResponse summary) {
        this.summary = summary;
    }

    public List<ReportChartResponse> getTaskStatusChart() {
        return taskStatusChart;
    }

    public void setTaskStatusChart(List<ReportChartResponse> taskStatusChart) {
        this.taskStatusChart = taskStatusChart;
    }

    public List<ReportChartResponse> getProjectStatusChart() {
        return projectStatusChart;
    }

    public void setProjectStatusChart(List<ReportChartResponse> projectStatusChart) {
        this.projectStatusChart = projectStatusChart;
    }

    public List<ReportChartResponse> getProductivityChart() {
        return productivityChart;
    }

    public void setProductivityChart(List<ReportChartResponse> productivityChart) {
        this.productivityChart = productivityChart;
    }

    public List<ReportActivityResponse> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ReportActivityResponse> recentActivities) {
        this.recentActivities = recentActivities;
    }
}