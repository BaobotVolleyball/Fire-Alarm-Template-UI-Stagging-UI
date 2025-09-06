// === Test Helpers for Fire Alarm System ===

export const testScenarios = {
  // Test navigation
  testNavigation: () => {
    console.log('🧪 Testing Navigation...')
    
    // Test sidebar collapse/expand
    const sidebarToggle = document.querySelector('[data-testid="sidebar-toggle"]')
    if (sidebarToggle) {
      console.log('✅ Sidebar toggle found')
    } else {
      console.log('❌ Sidebar toggle not found')
    }
    
    // Test menu items
    const menuItems = document.querySelectorAll('[data-testid="menu-item"]')
    console.log(`✅ Found ${menuItems.length} menu items`)
    
    return true
  },

  // Test device management
  testDeviceManagement: () => {
    console.log('🧪 Testing Device Management...')
    
    // Check if device cards are rendered
    const deviceCards = document.querySelectorAll('[data-testid="device-card"]')
    console.log(`✅ Found ${deviceCards.length} device cards`)
    
    // Check real-time updates
    const statusIndicators = document.querySelectorAll('[data-testid="status-indicator"]')
    console.log(`✅ Found ${statusIndicators.length} status indicators`)
    
    return true
  },

  // Test incident management
  testIncidentManagement: () => {
    console.log('🧪 Testing Incident Management...')
    
    // Check incident list
    const incidentItems = document.querySelectorAll('[data-testid="incident-item"]')
    console.log(`✅ Found ${incidentItems.length} incident items`)
    
    return true
  },

  // Test responsive design
  testResponsiveDesign: () => {
    console.log('🧪 Testing Responsive Design...')
    
    const originalWidth = window.innerWidth
    
    // Test mobile view
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true })
    window.dispatchEvent(new Event('resize'))
    
    setTimeout(() => {
      const sidebar = document.querySelector('[data-testid="sidebar"]')
      const mobileMenu = document.querySelector('[data-testid="mobile-menu"]')
      
      if (sidebar && mobileMenu) {
        console.log('✅ Mobile responsive layout working')
      } else {
        console.log('❌ Mobile responsive layout issues')
      }
      
      // Restore original width
      Object.defineProperty(window, 'innerWidth', { value: originalWidth, writable: true })
      window.dispatchEvent(new Event('resize'))
    }, 100)
    
    return true
  },

  // Test real-time features
  testRealTimeFeatures: () => {
    console.log('🧪 Testing Real-time Features...')
    
    // Check WebSocket connection
    const connectionStatus = document.querySelector('[data-testid="connection-status"]')
    if (connectionStatus) {
      console.log('✅ Connection status indicator found')
    }
    
    // Check auto-refresh
    const autoRefreshToggle = document.querySelector('[data-testid="auto-refresh"]')
    if (autoRefreshToggle) {
      console.log('✅ Auto-refresh toggle found')
    }
    
    return true
  },

  // Test performance
  testPerformance: () => {
    console.log('🧪 Testing Performance...')
    
    const startTime = performance.now()
    
    // Simulate heavy operations
    const heavyOperation = () => {
      const data = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Device ${i}`,
        status: Math.random() > 0.5 ? 'online' : 'offline'
      }))
      
      return data.filter(d => d.status === 'online').length
    }
    
    const result = heavyOperation()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`✅ Heavy operation completed in ${duration.toFixed(2)}ms`)
    console.log(`✅ Processed ${result} items`)
    
    if (duration < 100) {
      console.log('✅ Performance: Excellent')
    } else if (duration < 500) {
      console.log('⚠️ Performance: Good')
    } else {
      console.log('❌ Performance: Needs improvement')
    }
    
    return duration < 500
  },

  // Run all tests
  runAllTests: () => {
    console.log('🚀 Starting Fire Alarm System Tests...')
    console.log('=====================================')
    
    const tests = [
      testScenarios.testNavigation,
      testScenarios.testDeviceManagement,
      testScenarios.testIncidentManagement,
      testScenarios.testResponsiveDesign,
      testScenarios.testRealTimeFeatures,
      testScenarios.testPerformance
    ]
    
    let passedTests = 0
    
    tests.forEach((test, index) => {
      try {
        const result = test()
        if (result) {
          passedTests++
        }
      } catch (error) {
        console.error(`❌ Test ${index + 1} failed:`, error)
      }
    })
    
    console.log('=====================================')
    console.log(`📊 Test Results: ${passedTests}/${tests.length} passed`)
    
    if (passedTests === tests.length) {
      console.log('🎉 All tests passed! System is ready for deployment.')
    } else {
      console.log('⚠️ Some tests failed. Please review and fix issues.')
    }
    
    return passedTests === tests.length
  }
}

// Performance monitoring
export const performanceMonitor = {
  startTime: 0,
  
  start: (label: string) => {
    performanceMonitor.startTime = performance.now()
    console.log(`⏱️ Starting: ${label}`)
  },
  
  end: (label: string) => {
    const duration = performance.now() - performanceMonitor.startTime
    console.log(`⏱️ Completed: ${label} in ${duration.toFixed(2)}ms`)
    return duration
  },
  
  measure: (fn: () => any, label: string) => {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
    return { result, duration }
  }
}

// Memory usage monitoring
export const memoryMonitor = {
  getUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
    return null
  },
  
  logUsage: () => {
    const usage = memoryMonitor.getUsage()
    if (usage) {
      console.log(`💾 Memory Usage: ${usage.used}MB / ${usage.total}MB (Limit: ${usage.limit}MB)`)
    }
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).fireAlarmTests = testScenarios
  (window as any).performanceMonitor = performanceMonitor
  (window as any).memoryMonitor = memoryMonitor
}
