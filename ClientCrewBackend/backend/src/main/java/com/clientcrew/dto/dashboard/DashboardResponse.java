package com.clientcrew.dto.dashboard;

import java.util.List;

public class DashboardResponse {

    private String role;
    private DashboardStatsResponse stats;

    private List<DashboardChartResponse> customerGrowth;
    private List<DashboardChartResponse> projectProgressChart;
    private List<DashboardChartResponse> projectStatusChart;
    private List<DashboardChartResponse> taskStatusChart;

    private List<DashboardTaskResponse> recentTasks;
    private List<DashboardProjectResponse> recentProjects;
    private List<DashboardProjectResponse> topProjects;

    private List<DashboardActivityResponse> recentActivities;
    private List<DashboardNotificationResponse> recentNotifications;

    private List<DashboardUserResponse> teamMembers;
    private List<DashboardCustomerResponse> recentCustomers;
    private List<DashboardCustomerResponse> topCustomers;

    public DashboardResponse() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    
    public DashboardStatsResponse getStats() {
        return stats;
    }

    public void setStats(DashboardStatsResponse stats) {
        this.stats = stats;
    }

    public List<DashboardChartResponse> getCustomerGrowth() {
        return customerGrowth;
    }

    public void setCustomerGrowth(List<DashboardChartResponse> customerGrowth) {
        this.customerGrowth = customerGrowth;
    }

    public List<DashboardChartResponse> getProjectProgressChart() {
        return projectProgressChart;
    }

    public void setProjectProgressChart(List<DashboardChartResponse> projectProgressChart) {
        this.projectProgressChart = projectProgressChart;
    }

    public List<DashboardChartResponse> getProjectStatusChart() {
        return projectStatusChart;
    }

    public void setProjectStatusChart(List<DashboardChartResponse> projectStatusChart) {
        this.projectStatusChart = projectStatusChart;
    }

    public List<DashboardChartResponse> getTaskStatusChart() {
        return taskStatusChart;
    }

    public void setTaskStatusChart(List<DashboardChartResponse> taskStatusChart) {
        this.taskStatusChart = taskStatusChart;
    }

    public List<DashboardTaskResponse> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<DashboardTaskResponse> recentTasks) {
        this.recentTasks = recentTasks;
    }

    public List<DashboardProjectResponse> getRecentProjects() {
        return recentProjects;
    }

    public void setRecentProjects(List<DashboardProjectResponse> recentProjects) {
        this.recentProjects = recentProjects;
    }

    public List<DashboardProjectResponse> getTopProjects() {
        return topProjects;
    }

    public void setTopProjects(List<DashboardProjectResponse> topProjects) {
        this.topProjects = topProjects;
    }

    public List<DashboardActivityResponse> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<DashboardActivityResponse> recentActivities) {
        this.recentActivities = recentActivities;
    }

    public List<DashboardNotificationResponse> getRecentNotifications() {
        return recentNotifications;
    }

    public void setRecentNotifications(List<DashboardNotificationResponse> recentNotifications) {
        this.recentNotifications = recentNotifications;
    }

    public List<DashboardUserResponse> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(List<DashboardUserResponse> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public List<DashboardCustomerResponse> getRecentCustomers() {
        return recentCustomers;
    }

    public void setRecentCustomers(List<DashboardCustomerResponse> recentCustomers) {
        this.recentCustomers = recentCustomers;
    }

    public List<DashboardCustomerResponse> getTopCustomers() {
        return topCustomers;
    }

    public void setTopCustomers(List<DashboardCustomerResponse> topCustomers) {
        this.topCustomers = topCustomers;
    }
}