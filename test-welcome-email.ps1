$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ3hpY2p5bnV4c25pamhtdnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyOTE4NTAsImV4cCI6MjA4MTg2Nzg1MH0.-kGi0ojoEXtPNJP1x5Aj1KBE0TVUpoKhTzR1LGeslCI"
    "Content-Type" = "application/json"
}

$body = @{
    email = "your-email@gmail.com"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-welcome-email" -Method Post -Headers $headers -Body $body
