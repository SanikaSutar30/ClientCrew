package com.clientcrew.dto.report;

public class ReportChartResponse {

    private String name;
    private long value;

    public ReportChartResponse() {
    }

    public ReportChartResponse(String name, long value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }
}