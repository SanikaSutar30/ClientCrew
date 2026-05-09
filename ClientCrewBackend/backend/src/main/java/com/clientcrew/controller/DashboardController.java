package com.clientcrew.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clientcrew.dto.dashboard.DashboardResponse;
import com.clientcrew.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardData(
            @RequestParam(defaultValue = "THIS_MONTH") String filter
    ) {
        DashboardResponse response = dashboardService.getDashboardData(filter);
        return ResponseEntity.ok(response);
    }
}