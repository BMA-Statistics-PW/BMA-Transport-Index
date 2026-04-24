function Get-AverageSpeeds {
    param($filePath)
    $lines = Get-Content $filePath | ConvertFrom-Csv -Header "id", "road", "segment", "2560_in", "2560_out", "2561_in", "2561_out", "2562_in", "2562_out", "2563_in", "2563_out", "2564_in", "2564_out", "2565_in", "2565_out", "2566_in", "2566_out", "2567_in", "2567_out", "2568_in", "2568_out"
    $results = [ordered]@{}
    $years = 2560..2568
    
    foreach ($year in $years) {
        $inCol = "${year}_in"
        $outCol = "${year}_out"
        $inSum = 0
        $outSum = 0
        $count = 0
        
        foreach ($line in $lines) {
            if ($line.id -match '^\d+$') {
                $inStr = $line.$inCol -replace '[^\d\.]', ''
                $outStr = $line.$outCol -replace '[^\d\.]', ''
                
                if ([double]::TryParse($inStr, [ref]0.0) -and [double]::TryParse($outStr, [ref]0.0)) {
                    $inSum += [double]$inStr
                    $outSum += [double]$outStr
                    $count++
                }
            }
        }
        
        if ($count -gt 0) {
            $results["$year"] = [ordered]@{
                "inbound" = [math]::Round($inSum / $count, 2)
                "outbound" = [math]::Round($outSum / $count, 2)
            }
        }
    }
    return $results
}

$output = [ordered]@{
    "Urban" = Get-AverageSpeeds "data\travel-speed\zone_urban_trend_2560-2568.csv"
    "Suburban" = Get-AverageSpeeds "data\travel-speed\zone_suburban_trend_2560-2568.csv"
    "Rural" = Get-AverageSpeeds "data\travel-speed\zone_rural_trend_2560-2568.csv"
}

$output | ConvertTo-Json -Depth 5
