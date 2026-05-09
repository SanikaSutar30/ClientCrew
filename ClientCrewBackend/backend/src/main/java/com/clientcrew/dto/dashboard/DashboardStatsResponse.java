package com.clientcrew.dto.dashboard;

public class DashboardStatsResponse {

    private long totalProjects;
    private long totalTasks;
    private long totalCustomers;
    private long totalEmployees;
    private long totalManagers;

    private long completedTasks;
    private long pendingTasks;
    private long activeProjects;
    private long dueThisWeek;

    private long interactions;
    private long unreadNotifications;

    public DashboardStatsResponse() {
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalManagers() {
        return totalManagers;
    }

    public void setTotalManagers(long totalManagers) {
        this.totalManagers = totalManagers;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getDueThisWeek() {
        return dueThisWeek;
    }

    public void setDueThisWeek(long dueThisWeek) {
        this.dueThisWeek = dueThisWeek;
    }

    public long getInteractions() {
        return interactions;
    }

    public void setInteractions(long interactions) {
        this.interactions = interactions;
    }

    public long getUnreadNotifications() {
        return unreadNotifications;
    }

    public void setUnreadNotifications(long unreadNotifications) {
        this.unreadNotifications = unreadNotifications;
    }
}