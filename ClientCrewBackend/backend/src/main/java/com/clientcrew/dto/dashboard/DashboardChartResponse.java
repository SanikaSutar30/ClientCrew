package com.clientcrew.dto.dashboard;

public class DashboardChartResponse {

    private String label;
    private Long value;
    private String color;

    public DashboardChartResponse() {
    }

    public DashboardChartResponse(String label, Long value) {
        this.label = label;
        this.value = value;
    }

    public DashboardChartResponse(String label, Long value, String color) {
        this.label = label;
        this.value = value;
        this.color = color;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}