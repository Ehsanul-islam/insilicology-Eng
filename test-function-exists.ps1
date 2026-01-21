$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ3hpY2p5bnV4c25pamhtdnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyOTE4NTAsImV4cCI6MjA4MTg2Nzg1MH0.-kGi0ojoEXtPNJP1x5Aj1KBE0TVUpoKhTzR1LGeslCI"
    "Content-Type"  = "application/json"
}

Write-Host "Testing if send-enrollment-notification function exists..." -ForegroundColor Cyan

# Test with minimal payload
$body = @{
    enrollmentId = "test-id"
    type         = "submitted"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-enrollment-notification" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "SUCCESS! Function is accessible" -ForegroundColor Green
    Write-Host "Result: $($result | ConvertTo-Json)" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "`nFunction not found (404). Possible issues:" -ForegroundColor Yellow
        Write-Host "1. Function not deployed" -ForegroundColor Yellow
        Write-Host "2. Function name mismatch" -ForegroundColor Yellow
        Write-Host "3. Deployment still in progress" -ForegroundColor Yellow
    }
}
