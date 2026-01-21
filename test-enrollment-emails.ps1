$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ3hpY2p5bnV4c25pamhtdnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyOTE4NTAsImV4cCI6MjA4MTg2Nzg1MH0.-kGi0ojoEXtPNJP1x5Aj1KBE0TVUpoKhTzR1LGeslCI"
    "Content-Type"  = "application/json"
}

# Test with a real enrollment ID from your database
# Replace this with an actual enrollment ID
$enrollmentId = "your-enrollment-id-here"

Write-Host "Testing Enrollment Submitted Email..." -ForegroundColor Cyan
$body1 = @{
    enrollmentId = $enrollmentId
    type         = "submitted"
} | ConvertTo-Json

$result1 = Invoke-RestMethod -Uri "https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-enrollment-notification" -Method Post -Headers $headers -Body $body1
Write-Host "Result: $($result1 | ConvertTo-Json)" -ForegroundColor Green

Write-Host "`nTesting Enrollment Approved Email..." -ForegroundColor Cyan
$body2 = @{
    enrollmentId = $enrollmentId
    type         = "approved"
} | ConvertTo-Json

$result2 = Invoke-RestMethod -Uri "https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-enrollment-notification" -Method Post -Headers $headers -Body $body2
Write-Host "Result: $($result2 | ConvertTo-Json)" -ForegroundColor Green

Write-Host "`nTesting Enrollment Rejected Email..." -ForegroundColor Cyan
$body3 = @{
    enrollmentId = $enrollmentId
    type         = "rejected"
} | ConvertTo-Json

$result3 = Invoke-RestMethod -Uri "https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-enrollment-notification" -Method Post -Headers $headers -Body $body3
Write-Host "Result: $($result3 | ConvertTo-Json)" -ForegroundColor Green
