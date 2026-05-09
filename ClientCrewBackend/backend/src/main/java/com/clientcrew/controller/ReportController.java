package com.clientcrew.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clientcrew.dto.report.ReportDashboardResponse;
import com.clientcrew.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public ReportDashboardResponse getDashboardReport(Principal principal) {
        return reportService.getDashboardReport(principal.getName());
    }
}